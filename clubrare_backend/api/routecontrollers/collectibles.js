const genRes = require('../controllers/genres.js');
const mongoose = require('mongoose');
const Collectible = require('../controllers/collectibles.js');
const User = require('../controllers/users.js');
const RedeemOrder = require('../controllers/redeem_orders.js');
const constants = require("../../config/constant.js");
const contractObject = require("../../lib/contract_object.js");
const collectionArtifact = require("../../smart_contracts/build/contracts/Collection.json");
const { create } = require('ipfs-http-client');
//const ipfs = create({ host: '35.74.231.136', port: '8080', protocol: 'http' })
const ipfs = create({ host: '35.74.231.136', port: '5001', protocol: 'http' })
const fetch = require('node-fetch');

const uploadFileOnIpfs = async (buffer) => {
    return await ipfs.add(buffer);
}
const uploadObjectOnIpfs = async (fileHashCode, dataBody, collectiblePrice) => {
    let objForIpfs = {
        name: dataBody.title,
        description: (dataBody.description ? dataBody.description : ''),
        image: constants.ipfs_url + fileHashCode.cid.toString(),
        redeemable: dataBody.redeemable,
        redeemableType: dataBody.redeem_type,  // 1:burn or 2:not burn
        attributes: [{
            key: "GAME",
            trait_type: "GAME",
            value: "OVER"
        }],
        collection: {
            "@class": "com.rarible",
            "id": "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
            "nonce": 28,
            "name": "Rarible",
            "symbol": "RARI",
            "status": "CONFIRMED",
            "features": [
                "APPROVE_FOR_ALL",
                "SET_URI_PREFIX",
                "BURN",
                "MINT_WITH_ADDRESS",
                "SECONDARY_SALE_FEES"
            ],
            "standard": "ERC721",
            "startBlockNumber": 1,
            "version": 28
        },
        "price": collectiblePrice,
        "saleable": true,
        "lockable": false,
        "value": "1"
    }

    let jsonHash = await ipfs.add(JSON.stringify(objForIpfs));
    return jsonHash;
}

exports.createCollectible = async (req, res) => {
    const { title, royalties, wallet_address } = req.body;
    const dataBody = req.body;
    const objectForMongo = {};
    let collectiblePrice = "";

    if (!title) return res.send(genRes.generateResponse(false, "Title is required", 400, null));
    if (!royalties) return res.send(genRes.generateResponse(false, "Royalties is required", 400, null));
    if (!wallet_address) return res.send(genRes.generateResponse(false, "Wallet Address is required", 400, null));
    //console.log(wallet_address);
    if (!req.files) return res.send(genRes.generateResponse(false, "File is required", 400, null));
    const file = req.files.attachment;
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
        return res.send(genRes.generateResponse(false, "Invalid file format", 400, null));
    }

    objectForMongo.title = title;
    objectForMongo.royalties = royalties;
    objectForMongo.wallet_address = wallet_address;
    objectForMongo.description = (dataBody.description ? dataBody.description : '');
    objectForMongo.redeem_type = dataBody.redeem_type;

    if (dataBody.put_on_marketplace == true || dataBody.put_on_marketplace == 'true') {
        if (dataBody.fixed_price) {
            objectForMongo.fixed_price = dataBody.fixed_price;
            collectiblePrice = "" + dataBody.fixed_price;
        }
        else if (dataBody.timed_auction) {
            dataBody.timed_auction = JSON.parse(dataBody.timed_auction);
            objectForMongo.timed_auction = dataBody.timed_auction;
            collectiblePrice = "" + dataBody.timed_auction.minimum_bid;
        }
        else if (dataBody.unlimited_auction == true || dataBody.unlimited_auction == 'true') objectForMongo.unlimited_auction = true;
        else {
            return res.send(genRes.generateResponse(false, "Choose anyone in put on marketplace", 400, null));
        }
        objectForMongo.put_on_marketplace = true;
    }

    if (dataBody.unlock_purchased == true || dataBody.unlock_purchased == 'true') {
        if (!dataBody.digital_key_for_unlock_purchased) return res.send(genRes.generateResponse(false, "digital_key_for_unlock_purchased required", 400, null));
        objectForMongo.digital_key_for_unlock_purchased = dataBody.digital_key_for_unlock_purchased;
        objectForMongo.unlock_purchased = true;
    }

    if (dataBody.properties) {
        dataBody.properties = JSON.parse(dataBody.properties);
        objectForMongo.properties = dataBody.properties;
    }
    if (dataBody.alternative_text_for_NFT) objectForMongo.alternative_text_for_NFT = dataBody.alternative_text_for_NFT;

    let fileBuffer = file.data;
    try {
        const fileHashCode = await uploadFileOnIpfs(fileBuffer);
        const jsonHash = await uploadObjectOnIpfs(fileHashCode, dataBody, collectiblePrice);
        const ipfs_external_url = constants.ipfs_url + jsonHash.cid.toString();

        let result = await Collectible.create(objectForMongo); // insert data in mongo
        const response = {
            ipfs_external_url: ipfs_external_url,
            _id: result._id
        }
        return res.send(genRes.generateResponse(true, "Collectible successfully create", 200, response));
    } catch (error) {
        return res.send(genRes.generateResponse(false, error.message, 400, null));
    }

}

const getUrlFromBlockchainAndMongo = async (token, network_id) => {
    try {
        const { nftContract, brokerNftContract, web3, nftAddress } = await contractObject.getContractObject(network_id);
        let uri = await nftContract.methods.tokenURI(token).call();
        if (uri.includes("example")) uri = uri.replace("example", "");// for temprory
        let fetchFromIPFS = await fetch(uri); // fetch object data from IPFS based on given url
        fetchFromIPFS = await fetchFromIPFS.json();

        let collectionContract = new web3.eth.Contract(collectionArtifact.abi, nftAddress); //nftAddress is also collection
        let collectionUri = await collectionContract.methods.contractURI().call();
        try {
            var fetchCollectionFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
            fetchCollectionFromIPFS = await fetchCollectionFromIPFS.json();
        } catch (err) {
            console.log("err :", err);
        }

        const auctionList = await brokerNftContract.methods.auctions(nftAddress, token).call();
        const starting_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
        starting_time.setUTCSeconds(auctionList.startingTime);
        auctionList.starting_time = starting_time;
        const closing_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
        closing_time.setUTCSeconds(auctionList.closingTime);
        auctionList.closing_time = closing_time;
        auctionList.eth_current_bid = await web3.utils.fromWei(auctionList.currentBid, 'ether'); // convert in eth price;
        auctionList.eth_starting_price = await web3.utils.fromWei(auctionList.startingPrice, 'ether'); // convert in eth price;
        const eth_price = await web3.utils.fromWei(auctionList.buyPrice, 'ether'); // convert in eth price;
        const onSale = await brokerNftContract.methods.getOnSaleStatus(nftAddress, token).call(); // true/false
        const royalty = await nftContract.methods.royalities(token).call();
        const ownerWalletAddress = await nftContract.methods.ownerOf(token).call();
        const creatorWalletAddress = await nftContract.methods.creators(token).call();
        let creatorObject = await User.getBasedOnWallet(creatorWalletAddress);
        let ownerObject = await User.getBasedOnWallet(ownerWalletAddress);
        if (!creatorObject) {
            creatorObject = {
                name: creatorWalletAddress
            }
        }
        if (!ownerObject) {
            ownerObject = {
                name: ownerWalletAddress
            }
        }
        const query = {
            token_id: token
        }
        const collectibleData = await Collectible.get(query);
        const obj = {
            title: fetchFromIPFS.name,
            image_url: fetchFromIPFS.image,
            description: (fetchFromIPFS.description ? fetchFromIPFS.description : ''),
            creator_image: (creatorObject.image ? creatorObject.image : ""),
            creator_name: (creatorObject.name ? creatorObject.name : ""),
            creator_wallet_address: creatorWalletAddress,
            owner_wallet_address: ownerWalletAddress,
            royalties: royalty,
            price: auctionList.buyPrice,
            eth_price: eth_price,
            onSale: onSale,
            fixed_price: (auctionList.auctionType == 1 ? true : false),
            details: {
                owner_name: (ownerObject.name ? ownerObject.name : ""),
                owner_image: (ownerObject.image ? ownerObject.image : ""),
                year: (ownerObject.created_on ? ownerObject.created_on.getFullYear() : ""),
                artist: (ownerObject.name ? ownerObject.name : "")
            },
            collectible_data: collectibleData,
            collection: fetchCollectionFromIPFS,
            auction_detail: { ...auctionList }
        }
        return obj;
    } catch (err) {
        // console.log(err.message);
        return false;
    }
}

/** NFT Single Page, get collectible details based on token */
exports.getNFTSinglePage = async (req, res) => {
    const { token_id, network_id } = req.query;
    if (!token_id) return res.send(genRes.generateResponse(false, "Token is required", 400, null));
    if (!network_id) return res.send(genRes.generateResponse(false, "Network Id is required", 400, null));
    if (network_id != 1 && network_id != 2) return res.send(genRes.generateResponse(false, "Network Id is invalid", 400, null));

    let resObject = await getUrlFromBlockchainAndMongo(token_id, network_id);
    if (resObject === false) return res.send(genRes.generateResponse(false, "Not Found", 400, null));
    return res.send(genRes.generateResponse(true, "Found Successfully", 200, resObject));
}

exports.approveCollectible = async (req, res) => {
    try {
        const gas_required = await nftContract.methods
            .mint(randomTokenID, [{ recipient: account[0], value: 1 }], ipfs_external_url)
            .estimateGas();


        const { transactionHash } = await nftContract.methods
            .mint(randomTokenID, [{ recipient: account[0], value: 1 }], ipfs_external_url)
            .send({ from: walletAddress, gas: gas_required });   // account[2] -> wallet address    

        return res.send(genRes.generateResponse(true, "found", 200, { transactionHash }));
    } catch (error) {
        return res.send(genRes.generateResponse(false, error.message, 400, null));
    }
}

/* update collectible */
exports.updateCollectible = async (req, res) => {
    try {
        if (!req.body) throw new Error("Invalid Parameter");
        const collectible = req.body;
        const { _id } = collectible;
        if (!_id || _id == 'null' || _id == 'undefined') throw new Error("Id is Required");
        await Collectible.update(_id, collectible);
        return res.send(genRes.generateResponse(true, "Collectible update successfully", 200, null));
    } catch (error) {
        return res.send(genRes.generateResponse(false, error.message, 400, null));
    }
}

const getDataFromIPFS = async (redeemList) => {
    const network_id = 1;
    const { nftContract, brokerNftContract, web3 } = await contractObject.getContractObject(network_id);
    const response = [];
    for (let i = 0; i < redeemList.length; i++) {
        try {
            const element = redeemList[i];
            const userObject = await User.getBasedOnWallet(element.wallet_address);
            let collectionContract = new web3.eth.Contract(collectionArtifact.abi, element.collection_address);
            let collectionUri = await collectionContract.methods.contractURI().call();
            try {
                var fetchCollectionFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
                fetchCollectionFromIPFS = await fetchCollectionFromIPFS.json();
            } catch (err) {
                console.log("err :", err);
            }


            let uri = await collectionContract.methods.tokenURI(element.token_id).call();
            let fetchCollectibleFromIPFS = await fetch(uri); // fetch object data from IPFS based on given url
            fetchCollectibleFromIPFS = await fetchCollectibleFromIPFS.json();
            // console.log('fetchFromIPFS-here : ', fetchFromIPFS)
            const auctionList = await brokerNftContract.methods.auctions(element.collection_address, element.token_id).call();
            const starting_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
            starting_time.setUTCSeconds(auctionList.startingTime);
            auctionList.starting_time = starting_time;
            const closing_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
            closing_time.setUTCSeconds(auctionList.closingTime);
            auctionList.closing_time = closing_time;
            const eth_price = await web3.utils.fromWei(auctionList.buyPrice, 'ether'); // convert in eth price;
            const royalty = await nftContract.methods.royalities(element.token_id).call();
            const eth_royalty = await web3.utils.fromWei(royalty, 'ether'); // convert in eth royalty;
            let temp = JSON.parse(JSON.stringify(element));
            const obj = {
                ...temp,
                image: fetchCollectibleFromIPFS.image,
                name: fetchCollectibleFromIPFS.name,
                title: fetchCollectibleFromIPFS.name,
                redeemable: fetchCollectibleFromIPFS.redeemable,
                redeemableType: fetchCollectibleFromIPFS.redeemableType,
                price: auctionList.buyPrice,
                eth_price: eth_price,
                royalties: royalty,
                eth_royalties: eth_royalty,
                collection: fetchCollectionFromIPFS,
                user: userObject,
                auction_detail: { ...auctionList }
            }
            response.push(obj);
        } catch (err) {
            console.log("error , ", err);
            continue;
        }
    }
    return response;
}

/**
 * get redeemable list
 */
exports.getRedeemList = async (req, res) => {
    try {
        const redeemList = await Collectible.getRedeemable();
        if (redeemList.length === 0) throw new Error("Redeem List not found");
        const redeemData = await getDataFromIPFS(redeemList);
        if (redeemData.length === 0) throw new Error("Redeem list not found");
        return res.send(genRes.generateResponse(true, "Redeem list successfully found", 200, redeemData));
    } catch (error) {
        return res.send(genRes.generateResponse(false, error.message, 400, null));
    }
}