const request = require('request');
const mongoose = require('mongoose');
const User = require('../controllers/users.js');
const genRes = require('../controllers/genres.js');
const Collectible = require('../controllers/collectibles.js');
const Notification = require('../controllers/notifications.js');
const contractObject = require("../../lib/contract_object.js");
const constants = require("../../config/constant.js");
const fetch = require('node-fetch');
const { create } = require('ipfs-http-client');
const { response } = require('express');
const ipfs = create();
const collectionArtifact = require("../../smart_contracts/build/contracts/Collection.json");
const Web3 = require('web3');

/** function for get user cover image url based on wallet address */
exports.getCoverImage = async (req, res) => {
	const query = req.query;
	if (!query) return res.send(genRes.generateResponse(false, "Invalid Parameter", 400, null));

	const { wallet_address } = query;
	if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	let userObject = await User.getCoverImage(wallet_address);
	userObject = JSON.parse(userObject);
	if (userObject.status) {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	} else {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	}
}
 

/** function for create user */
exports.createUser = async (req, res) => {
	if (!req.body) return res.send(genRes.generateResponse(false, "Invalid Parameter", 400, null));

	const { wallet_address } = req.body;
	if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	let userObject = await User.get(wallet_address);
	userObject = JSON.parse(userObject);
	if (userObject.status) {
		if (userObject.data.isBlock) return res.send(genRes.generateResponse(false, "User is block", 400, null));
		return res.send(userObject);
	} else {
		const user = {
			wallet_address: wallet_address
		}
		const userCreateObject = await User.create(user);

		// insert value in notification 
		const notification = {
			wallet_address: wallet_address,
			notifications: [{
				title: "Welcome",
				data: "Welcome to new world of NFT",
				content: wallet_address + "_1"
			}]
		}
		await Notification.create(notification);

		return res.send(userCreateObject);
	}
}

const uploadFileOnIpfs = async (buffer) => {
	try {
		return await ipfs.add(buffer);
	} catch (error) {
		return false;
	}
}

/** function for update user */
exports.updateUser = async (req, res) => {
	if (!req.body) return res.send(genRes.generateResponse(false, "Invalid Parameter", 400, null));
	const user = req.body;
	const { wallet_address } = user;
	if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	if (req.files) {
		const file = req.files.attachment;
		if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
			return res.send(genRes.generateResponse(false, "Invalid file format", 400, null));
		}
		const fileBuffer = file.data;
		const fileHashCode = await uploadFileOnIpfs(fileBuffer);
		if (fileHashCode === false) {
			return res.send(genRes.generateResponse(false, "Image upload failed", 400, null));
		}
		const image_url = constants.ipfs_url + fileHashCode.cid.toString();
		user.image = image_url;
	}

	let userObject = await User.update(wallet_address, user);
	userObject = JSON.parse(userObject);
	if (userObject.status) {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	} else {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	}
}


/** function for update users cover image*/
exports.updateCoverImage = async (req, res) => {
	if (!req.body) return res.send(genRes.generateResponse(false, "Invalid Parameter", 400, null));
	const { wallet_address } = req.body;
	if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	const params = {};
	if (req.files) {
		const file = req.files.attachment;
		if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
			return res.send(genRes.generateResponse(false, "Invalid file format", 400, null));
		}
		const fileBuffer = file.data;
		const fileHashCode = await uploadFileOnIpfs(fileBuffer);
		if (fileHashCode === false) {
			return res.send(genRes.generateResponse(false, "Cover Image upload failed", 400, null));
		}
		var image_url = constants.ipfs_url + fileHashCode.cid.toString();
		params.cover_image = image_url;
	} else {
		return res.send(genRes.generateResponse(false, "Cover image required", 400, null));
	}

	let userObject = await User.updateCoverImage(wallet_address, params);
	userObject = JSON.parse(userObject);
	if (userObject.status) {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	} else {
		return res.send(genRes.generateResponse(userObject.status, userObject.message, userObject.code, userObject.data));
	}
}



const getUriByTokenIds = async (ids, walletAddress, network_id, contact, collection, collection_address) => {
	const { nftContract, brokerNftContract, web3 } = await contractObject.getContractObject(network_id);
	const userObject = await User.getBasedOnWallet(walletAddress);
	let data = new Array();
	const myItems = [];
	for (let i = 0; i < ids.length; i++) {
		try {
			let id = ids[i];
			let uri = await contact.methods.tokenURI(id).call();
			//console.log(uri);
			if (uri.includes("example")) uri = uri.replace("example", "");// for temprory
			let fetchFromIPFS = await fetch(uri); // fetch object data from IPFS based on given url
			fetchFromIPFS = await fetchFromIPFS.json();
			// const price = await brokerNftContract.methods.prices(id).call();
			const auctionList = await brokerNftContract.methods.auctions(collection_address, id).call();
			const starting_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			starting_time.setUTCSeconds(auctionList.startingTime);
			auctionList.starting_time = starting_time;
			const closing_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			closing_time.setUTCSeconds(auctionList.closingTime);
			auctionList.closing_time = closing_time;
			const eth_price = await web3.utils.fromWei(auctionList.buyPrice, 'ether'); // convert in eth price;
			const onSale = await brokerNftContract.methods.getOnSaleStatus(collection_address, id).call(); // true/false
			const ownerWalletAddress = await contact.methods.ownerOf(id).call();
			const creatorWalletAddress = await contact.methods.creators(id).call();
			const creatorObject = await User.getBasedOnWallet(creatorWalletAddress);
			const ownerObject = await User.getBasedOnWallet(ownerWalletAddress);
			const query = {
				token_id: id
			 }
			const collectibleData = await Collectible.get(query);
			const obj = {
				name: fetchFromIPFS.name,
				image: fetchFromIPFS.image,
				price: auctionList.buyPrice,
				eth_price: eth_price,
				creator: (creatorObject.name ? creatorObject.name : creatorWalletAddress),
				token_id: id,
				collection: collection,
				onSale: onSale,
				fixed_price: (auctionList.auctionType == 1 ? true : false),
				creator_image: (creatorObject.image ? creatorObject.image : ""), // image contain ipfs url  // 'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R', // it will be replace with dynamic image
				owner: (ownerObject.name ? ownerObject.name : ownerWalletAddress),
				owner_image: (ownerObject.image ? ownerObject.image : ""), // image contain ipfs url //'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R' // it will be replace with dynamic image
				auction_detail: {...auctionList},
				collectible_data : collectibleData 
			}
			// console.log('obj : ', obj);
			myItems.push(obj);
		} catch (err) {
			// console.log('console.error : ', err);
			continue;
		}
	}
	const tempObj = {
		user_info: userObject,
		myItems: myItems
	} 
	data.push(tempObj);
	return data;
}

// Get all items present in contact
const getUriForMyItems = async (walletAddress, network_id) => {
	// get list of addressess -> return array
	const { collectionFactoryContract } = await contractObject.getCollectionObject(network_id);

	const { nftContract, brokerNftContract, web3, nftAddress } = await contractObject.getContractObject(network_id);
	const totalSupply = await nftContract.methods.balanceOf(walletAddress).call();
	const items = new Array();
	// console.log("first total sypply : ", totalSupply);
	for (let i = totalSupply - 1; i >= 0; i--) {
		items.push(
			await nftContract.methods
				.tokenOfOwnerByIndex(walletAddress, i)
				.call()
		)
	}
	let collectionUri = await nftContract.methods.contractURI().call();
	try {
		var fetchFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
		fetchFromIPFS = await fetchFromIPFS.json();
	} catch (err) {
		console.log("err :", err);
	}
	if (items.length === 0) return [];
	let nftContractData = await getUriByTokenIds(items, walletAddress, network_id, nftContract, fetchFromIPFS, nftAddress);
	// console.log('nftContractData :', nftContractData);
	//fetch Contact Collections 
	let collectionResult = []
	const collection_address = await collectionFactoryContract.methods.getUserCollection(walletAddress).call();
	if (collection_address && collection_address.length > 0) {
		for (let k = 0; k < collection_address.length; k++) {
			try {
				let element = collection_address[k];
				let collectionContract = new web3.eth.Contract(collectionArtifact.abi, element);
				let collectionUri = await collectionContract.methods.contractURI().call();
				try {
					var fetchFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
					fetchFromIPFS = await fetchFromIPFS.json();
				} catch (err) {
					console.log("err :", err);
				}

				const totalSupply = await collectionContract.methods.balanceOf(walletAddress).call();
				// console.log('totalSupply : ', totalSupply);
				const Collectionitems = new Array();
				for (let i = totalSupply - 1; i >= 0; i--) {
					Collectionitems.push(await collectionContract.methods.tokenOfOwnerByIndex(walletAddress, i).call())
				}
				if (Collectionitems.length === 0) continue;
				// console.log("fetchFromIPFS : ", fetchFromIPFS)
				//	collectionResult = await getUriByTokenIds(Collectionitems, walletAddress, network_id,collectionContract, fetchFromIPFS);
				const collectionData = await getUriByTokenIds(Collectionitems, walletAddress, network_id, collectionContract, fetchFromIPFS, element);
				collectionResult.push(...collectionData[0].myItems);
			} catch (err) {
				console.log(err)
				continue;
			}
		}
	}
	nftContractData[0].myItems.push(...collectionResult)
	let result = [
		...nftContractData
		// ...collectionResult
	]
	return result
	// await getUriByTokenIds(items, walletAddress, network_id, collectionContract); 
}

/** get my items list based on wallet address and token id */
exports.getMyItemsList = async (req, res) => {
	const { wallet_address, network_id } = req.query;
	if (!wallet_address) return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	try {
		if (!network_id) throw new Error("Network Id is required");
		if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
		const uriArray = await getUriForMyItems(wallet_address, network_id);
		if (uriArray.length === 0 || uriArray[0].myItems.length === 0) throw new Error("My items not found");
		return res.send(genRes.generateResponse(true, "My items successfully found", 200, uriArray));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

const getUriForAllItems = async (network_id) => {
	const { nftContract, brokerNftContract, web3 } = await contractObject.getContractObject(network_id);
	const totalSupply = await nftContract.methods.totalSupply().call();
	let items = new Array();
	for (let i = 0; i < totalSupply; i++) {
		items.push(
			await nftContract.methods
				.tokenByIndex(i)
				.call()
		)
	}
	return await getUriByTokenIds(items, '', network_id);
}

/** get my items list based on wallet address and token id */
exports.getAllItemsList = async (req, res) => {
	try {
		const { network_id } = req.query;
		if (!network_id) throw new Error("Network Id is required");
		if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
		const uriArray = await getUriForAllItems(network_id);
		if (uriArray.length === 0) throw new Error("My items not found");
		return res.send(genRes.generateResponse(true, "URI successfully found", 200, uriArray));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

/** get user based on wallet address : only single user */
exports.getUserBasedOnWallet = async (req, res) => {
	const walletAddress = req.query.wallet_address;
	if (!walletAddress) return res.send(genRes.generateResponse(false, "Wallet Address is Required", 400, null));
	try {
		const userObject = await User.getBasedOnWallet(walletAddress);
		return res.send(genRes.generateResponse(true, "User successfully found", 200, userObject));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

/** function for update isBlock & block_by field */
exports.blockUser = async (req, res) => {
	const user = req.body;
	try {
		if (!user) throw new Error("Invalid Parameter");
		const { block_to, block_by, isBlock } = user;
		if (!block_to || block_to == 'null' || block_to == 'undefined') throw new Error("Block To is Required");
		if (!block_by || block_by == 'null' || block_by == 'undefined') throw new Error("Block_by is Required");
		if (typeof isBlock != 'boolean') throw new Error("Invalid Parameter");

		await User.blockUser(block_to, user);
		return res.send(genRes.generateResponse(true, "User successfully blocked", 200, null));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}


const getTokenAndPriceFromBlockchain = async (wallet_address, network_id) => {
	const { nftContract, brokerNftContract, web3 } = await contractObject.getContractObject(network_id);
	const tokenArr = await brokerNftContract.methods.getTokensForSalePerUser(wallet_address).call();
	// console.log('tokenArr : ', tokenArr);
	if (tokenArr.length === 0) return [];
	const myItems = [];
	for (let i = 0; i < tokenArr.length; i++) {
		try {
			let id = tokenArr[i].tokenID;
			let collection_address = tokenArr[i].NFTAddress;
			let collectionContract = new web3.eth.Contract(collectionArtifact.abi, collection_address);
			let collectionUri = await collectionContract.methods.contractURI().call();
			try {
				var fetchCollectionFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
				fetchCollectionFromIPFS = await fetchCollectionFromIPFS.json();
			} catch (err) {
				console.log("err :", err);
			}

			let uri = await nftContract.methods.tokenURI(id).call();
			if (uri.includes("example")) uri = uri.replace("example", "");// for temprory
			//console.log(uri)
			let fetchFromIPFS = await fetch(uri); // fetch object data from IPFS based on given url
			fetchFromIPFS = await fetchFromIPFS.json();
			const auctionList = await brokerNftContract.methods.auctions(collection_address, id).call();
			const starting_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			starting_time.setUTCSeconds(auctionList.startingTime);
			auctionList.starting_time = starting_time;
			const closing_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			closing_time.setUTCSeconds(auctionList.closingTime);
			auctionList.closing_time = closing_time;
			const eth_price = await web3.utils.fromWei(auctionList.buyPrice, 'ether'); // convert in eth price;
			const onSale = await brokerNftContract.methods.getOnSaleStatus(collection_address, id).call(); // true/false // ye change hoga
			const ownerWalletAddress = await nftContract.methods.ownerOf(id).call();
			const creatorWalletAddress = await nftContract.methods.creators(id).call();
			const creatorObject = await User.getBasedOnWallet(creatorWalletAddress);
			const ownerObject = await User.getBasedOnWallet(ownerWalletAddress);
			const query = {
				token_id: id
			 }
			const collectibleData = await Collectible.get(query);
			const obj = {
				name: fetchFromIPFS.name,
				image: fetchFromIPFS.image,
				price: auctionList.buyPrice,
				eth_price: eth_price,
				creator: (creatorObject.name ? creatorObject.name : creatorWalletAddress),
				token_id: id,
				onSale: onSale,
				fixed_price: (auctionList.auctionType == 1 ? true : false),
				creator_image: (creatorObject.image ? creatorObject.image : ""), // image contain ipfs url  // 'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R', // it will be replace with dynamic image
				owner: (ownerObject.name ? ownerObject.name : ownerWalletAddress),
				owner_image: (ownerObject.image ? ownerObject.image : ""), // image contain ipfs url //'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R' // it will be replace with dynamic image
				auction_detail: {...auctionList},
				collection_details: fetchCollectionFromIPFS,
				collectible_data : collectibleData 
			}
			myItems.push(obj);
		} catch (err) {
			console.log('err : ', err);
			continue;
		}

	}
	return myItems;
}

/** get on sale list based on wallet address */
exports.getMyItemsOnSale = async (req, res) => {
	const { wallet_address, network_id } = req.query;
	try {
		if (!wallet_address) throw new Error("Wallet Address is Required");
		if (!network_id) throw new Error("Network Id is required");
		if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
		const result = await getTokenAndPriceFromBlockchain(wallet_address, network_id);
		if (result.length === 0) throw new Error("On Sale items not found");
		return res.send(genRes.generateResponse(true, "On Sale items successfully found", 200, result));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

const getExploreListFromBlockchain = async (network_id) => {
	const { nftContract, brokerNftContract, web3 } = await contractObject.getContractObject(network_id);
	const tokenArr = await brokerNftContract.methods.getTokensForSale().call();
	if (tokenArr.length === 0) return [];
	const myItems = [];
	for (let i = 0; i < tokenArr.length; i++) {
		try {
			let id = tokenArr[i].tokenID;
			let collection_address = tokenArr[i].NFTAddress;
			let collectionContract = new web3.eth.Contract(collectionArtifact.abi, collection_address);
			let collectionUri = await collectionContract.methods.contractURI().call();
			try {
				var fetchCollectionFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
				fetchCollectionFromIPFS = await fetchCollectionFromIPFS.json();
			} catch (err) {
				console.log("err :", err);
			}

			let uri = await nftContract.methods.tokenURI(id).call();
			if (uri.includes("example")) uri = uri.replace("example", "");// for temprory
			let fetchFromIPFS = await fetch(uri); // fetch object data from IPFS based on given url
			fetchFromIPFS = await fetchFromIPFS.json();
			// const auctionList { buyPrice, auctionType } = await brokerNftContract.methods.auctions(collection_address, id).call();
			const auctionList = await brokerNftContract.methods.auctions(collection_address, id).call();
			const starting_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			starting_time.setUTCSeconds(auctionList.startingTime);
			auctionList.starting_time = starting_time;
			const closing_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
			closing_time.setUTCSeconds(auctionList.closingTime);
			auctionList.closing_time = closing_time;
			const eth_price = await web3.utils.fromWei(auctionList.buyPrice, 'ether'); // convert in eth price;
			const onSale = await brokerNftContract.methods.getOnSaleStatus(collection_address, id).call(); // true/false // ye change hoga
			const ownerWalletAddress = await nftContract.methods.ownerOf(id).call();
			const creatorWalletAddress = await nftContract.methods.creators(id).call();
			let creatorObject = await User.getBasedOnWallet(creatorWalletAddress);
			let ownerObject = await User.getBasedOnWallet(ownerWalletAddress);
			if(!creatorObject) {
				creatorObject = {
					name : creatorWalletAddress
				}
			}
			if(!ownerObject) {
				ownerObject = {
					name : ownerWalletAddress
				}
			}
			const query = {
				token_id: id
			 }
			const collectibleData = await Collectible.get(query);
			const obj = {
				name: fetchFromIPFS.name,
				image: fetchFromIPFS.image,
				price: auctionList.buyPrice,
				eth_price: eth_price,
				creator: (creatorObject.name ? creatorObject.name : creatorWalletAddress),
				token_id: id,
				onSale: onSale,
				fixed_price: (auctionList.auctionType == 1 ? true : false),
				creator_image: (creatorObject.image ? creatorObject.image : ""), // image contain ipfs url  // 'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R', // it will be replace with dynamic image
				owner: (ownerObject.name ? ownerObject.name : ownerWalletAddress),
				owner_image: (ownerObject.image ? ownerObject.image : ""), // image contain ipfs url //'http://8c58b7099641.ngrok.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R' // it will be replace with dynamic image
				auction_detail: {...auctionList},
				collection_details: fetchCollectionFromIPFS,
				collectible_data : collectibleData 
			}
			myItems.push(obj);
		} catch (err) {
			console.log('yaha hai err: ', err);
			continue;
		}
	}
	return myItems;
}

/** get explore list */
exports.getExploreList = async (req, res) => {
	try {
		const { network_id } = req.query;
		if (!network_id) throw new Error("Network Id is required");
		if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
		const result = await getExploreListFromBlockchain(network_id);
		if (result.length === 0) throw new Error("Explore list not found");
		return res.send(genRes.generateResponse(true, "Explore list successfully found", 200, result));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

// Get all items present in contact
const getTokenForMyItemsCreatorList = async (walletAddress, network_id) => {
	const { nftContract, brokerNftContract, web3, nftAddress} = await contractObject.getContractObject(network_id);
	// get list of addressess -> return array
	const { collectionFactoryContract } = await contractObject.getCollectionObject(network_id);
	const tokens = await nftContract.methods.getTokensPerCreator(walletAddress).call(); // return array

	let collectionUri = await nftContract.methods.contractURI().call();
	try {
		var fetchFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
		fetchFromIPFS = await fetchFromIPFS.json();
	} catch (err) {
		console.log("error :", err);
	}
	if (tokens.length === 0) return [];
	let nftContractData = await getUriByTokenIds(tokens, walletAddress, network_id, nftContract, fetchFromIPFS, nftAddress);
	// console.log('nftContractData :', nftContractData);
	//fetch Contact Collections
	let collectionResult = []
	const collection_address = await collectionFactoryContract.methods.getUserCollection(walletAddress).call();
	if (collection_address && collection_address.length > 0) {
		for (let k = 0; k < collection_address.length; k++) {
			try {
				let element = collection_address[k];
				let collectionContract = new web3.eth.Contract(collectionArtifact.abi, element);
				let collectionUri = await collectionContract.methods.contractURI().call();
				try {
					var fetchFromIPFS = await fetch(collectionUri); // fetch object data from IPFS based on given url
					fetchFromIPFS = await fetchFromIPFS.json();
				} catch (err) {
					console.log("err :", err);
				}

				const totalSupply = await collectionContract.methods.balanceOf(walletAddress).call();
				console.log('totalSupply : ', totalSupply);
				const Collectionitems = new Array();
				for (let i = totalSupply - 1; i >= 0; i--) {
					Collectionitems.push(await collectionContract.methods.tokenOfOwnerByIndex(walletAddress, i).call())
				}
				if (Collectionitems.length === 0) continue;
				// console.log("fetchFromIPFS : ", fetchFromIPFS)
				//	collectionResult = await getUriByTokenIds(Collectionitems, walletAddress, network_id,collectionContract, fetchFromIPFS);
				const collectionData = await getUriByTokenIds(Collectionitems, walletAddress, network_id, collectionContract, fetchFromIPFS, element);
				collectionResult.push(...collectionData[0].myItems);
			} catch (err) {
				console.log(err)
				continue;
			}
		}
	}

	nftContractData[0].myItems.push(...collectionResult)
	let result = [
		...nftContractData
	]
	return result
	// await getUriByTokenIds(items, walletAddress, network_id, collectionContract); 
}

/** get my items created list based on wallet address */
exports.getMyItemsCreatedList = async (req, res) => {
	const { wallet_address, network_id } = req.query;
	try {
		if (!wallet_address) throw new Error("Wallet Address is Required");
		if (!network_id) throw new Error("Network Id is required");
		if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
		const creatorList = await getTokenForMyItemsCreatorList(wallet_address, network_id);
		if (creatorList.length === 0 || creatorList[0].myItems.length === 0 ) throw new Error("My items creator not found");
		return res.send(genRes.generateResponse(true, "My items creator successfully found", 200, creatorList));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

/**
 * get users data based on skip(limit offset) 
 */
exports.getAll = async (req, res) => {
	let { page_number } = req.query;
	try {
		if (!page_number) throw new Error("Page Number is Required");
		page_number = parseInt(page_number);
		if (page_number < 1) throw new Error("Page Number should not be less than 1");
		const skip_data = (page_number - 1) * 10;
		const params = {
			skip_data: skip_data
		}
		const user = await User.getAll(params);
		if (user.length === 0) throw new Error("Users not found");
		const responseArr = [];
		user.forEach(item => {
			let obj = {
				image: (item.image ? item.image : ""),
				name: (item.name ? item.name : ""),
				url: (item.custom_url ? item.custom_url : "www.sanjusanju.com"),
				status: (item.isBlock ? 'Inactive' : 'Active'),
				wallet_address: item.wallet_address
			}
			responseArr.push(obj);
		})
		return res.send(genRes.generateResponse(true, "Users successfully found", 200, responseArr));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

/* get top buyers data */
exports.getTopBuyers = async (req, res) => {

	let obj = [
		{
			name: 'BigComicArt',
			amount: '3.181 ETH',
			image: 'https://ipfs.io/ipfs/QmREaL2C4wMJVJBGTp633grj2UjyL8a7baf11uiq7hwhDw?filename=image1.png'
		},
		{
			name: 'Satman',
			amount: '2 ETH',
			image: 'https://ipfs.io/ipfs/QmSQ429wgEbwiydFKXyXdgDRMDustgcDsW3oN24rKxEsrs?filename=image2.gif'
		},
		{
			name: 'Koceila Chougar',
			amount: '1.221 ETH',
			image: 'https://ipfs.io/ipfs/QmamYLoTiG6BQJQYvN6auiuYQ9b5Mj48WzRjsfvFvAFYVR?filename=image3.jpg'
		},
		{
			name: 'BatSoup.crypto',
			amount: '0.8 ETH',
			image: 'https://ipfs.io/ipfs/QmQ7gpmVWB1KSk8BKL1Xz5AkeTyS7nAkrQpbhHUaJVDP2R?filename=image4.png'
		},
		{
			name: 'Revobit',
			amount: '0.7 ETH',
			image: 'https://ipfs.io/ipfs/QmY9KPktVDQhvr1FA4Tq6cKaCMS8KukbZD4bYQ69zenS2z?filename=image5.svg'
		}
	];

	return res.send(genRes.generateResponse(true, 'Data Found', 200, obj));

}


/* get top sellers data */
exports.getTopSellers = async (req, res) => {

	let obj = [
		{
			name: 'Adijavar',
			amount: '5.51 ETH',
			image: 'https://ipfs.io/ipfs/QmRxg2ANzFBGovRumhi7LgyY4jrRN9tK2Zxk5w1WbYaQKN?filename=image8.gif'
		},
		{
			name: 'Dikasso',
			amount: '4.345 ETH',
			image: 'https://ipfs.io/ipfs/QmWRmg11ArfY8f9mjapNGTW2DAwTDU51qjvuDqVjC4Dr1H?filename=image7.gif'
		},
		{
			name: 'Johnny Dollar',
			amount: '2 ETH',
			image: 'https://ipfs.io/ipfs/Qmbbzagsz2WApoUUzxt9Rzxz4wCcqmmiRqGbkf6Co3MbXD?filename=image6.gif'
		},
		{
			name: 'Koceila Chougar',
			amount: '1.558 ETH',
			image: 'https://ipfs.io/ipfs/QmY9KPktVDQhvr1FA4Tq6cKaCMS8KukbZD4bYQ69zenS2z?filename=image5.svg'
		},
		{
			name: 'Lenieme',
			amount: '1 ETH',
			image: 'https://ipfs.io/ipfs/QmSQ429wgEbwiydFKXyXdgDRMDustgcDsW3oN24rKxEsrs?filename=image2.gif'
		}
	];

	return res.send(genRes.generateResponse(true, 'Data Found', 200, obj));

}

exports.getLiveAuctions = async (req, res) => {

	let obj = [
		{
			name: 'Adijavar',
			collection: "Rarible",
			owner: "ASH",
			creator: "ASH",
			like: 234,
			highest_bid_by: "trinity",
			amount: '0.002 wETH',
			start_date: "2021-06-01T12:26:25.742Z",
			end_date: "2021-06-02T12:26:25.742Z",
			image: 'https://ipfs.io/ipfs/Qmbbzagsz2WApoUUzxt9Rzxz4wCcqmmiRqGbkf6Co3MbXD?filename=image6.gif'
		},
		{
			name: 'Dikasso',
			collection: "Rarible",
			owner: "Sanju",
			creator: "Sanju",
			like: 867,
			highest_bid_by: "NFTY Collection",
			amount: '0.887 wETH',
			start_date: "2021-06-02T09:26:25.742Z",
			end_date: "2021-06-02T11:26:25.742Z",
			image: 'https://ipfs.io/ipfs/QmWRmg11ArfY8f9mjapNGTW2DAwTDU51qjvuDqVjC4Dr1H?filename=image7.gif'
		},
		{
			name: 'Koceila Chougar',
			collection: "Rarible",
			owner: "Barrow",
			creator: "Barrow",
			like: 126,
			highest_bid_by: "Newt9",
			amount: '2 wETH',
			start_date: "2021-06-02T09:26:25.742Z",
			end_date: "2021-06-03T12:20:23.742Z",
			image: 'https://ipfs.io/ipfs/QmRxg2ANzFBGovRumhi7LgyY4jrRN9tK2Zxk5w1WbYaQKN?filename=image8.gif'
		},
		{
			name: 'Johnny Dollar',
			collection: "Tingoo",
			owner: "KUADO",
			creator: "KUADO",
			like: 456,
			highest_bid_by: "Alexandra De Ra Lovis",
			amount: '1.558 wETH',
			start_date: "2021-06-02T09:26:25.742Z",
			end_date: "2021-06-02T12:23:25.742Z",
			image: 'https://ipfs.io/ipfs/QmSQ429wgEbwiydFKXyXdgDRMDustgcDsW3oN24rKxEsrs?filename=image2.gif'
		},
		{
			name: 'Lenieme',
			collection: "Tingoo",
			owner: "Forexus",
			creator: "Alex_Hax",
			like: 630,
			highest_bid_by: "Jingles",
			amount: '0.001 wETH',
			start_date: "2021-06-02T10:24:25.742Z",
			end_date: "2021-06-04T13:26:25.742Z",
			image: 'https://ipfs.io/ipfs/QmY9KPktVDQhvr1FA4Tq6cKaCMS8KukbZD4bYQ69zenS2z?filename=image5.svg'
		}
	];

	return res.send(genRes.generateResponse(true, 'Data Found', 200, obj));
}