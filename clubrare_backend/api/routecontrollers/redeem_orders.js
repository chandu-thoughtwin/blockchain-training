const genRes = require('../controllers/genres.js');
const RedeemOrder = require('../controllers/redeem_orders.js');
const mintableArtifact = require("../../smart_contracts/build/contracts/MintableToken.json");
const contractObject = require("../../lib/contract_object.js");
const Collectible = require('../controllers/collectibles.js');

exports.create = async (req, res) => {
	try {
        const redeemorder = req.body;
		if (!redeemorder) throw new Error("Invalid Parameter");
		const { token_id } = redeemorder;
		// if (!contract_address || contract_address == 'null' || contract_address == 'undefined') throw new Error("Contract Address is Required");
		if (!token_id || token_id == 'null' || token_id == 'undefined') throw new Error("Token id is Required");
		await RedeemOrder.create(redeemorder);
		return res.send(genRes.generateResponse(true, "Redeem order successfully create", 200, null));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

const getDataFromBlockchain = async (redeemorder) => {
	// const { web3 } = await contractObject.getContractObject(network_id);
    let redeemArr = [];
    for (let i=0; i<redeemorder.length; i++){
        try {
        // const { contract_address, token_id } = redeemorder[i]
        // const mintContract = new web3.eth.Contract(mintableArtifact.abi, contract_address);
        // const verified = await mintContract.methods.verified(token_id).call();
		// const redeemable = await mintContract.methods.redeemable(token_id).call();
		const { token_id } = redeemorder[i];
		const query = {
            token_id: token_id
         }
        const collectibleData = await Collectible.get(query);
		// console.log('collectibleData : ', collectibleData)
		// const burnable = await mintContract.methods.burnable(token_id).call();
        // redeemorder[i].verified = verified;
        // redeemorder[i].redeemable = redeemable;
		const collectible_data = { 
			collection_address: collectibleData.collection_address,
			redeem_type: collectibleData.redeem_type,
			redeemable: collectibleData.redeemable,
			redeem_verified: collectibleData.redeem_verified,
			token_id: collectibleData.token_id,
			transaction_hash: collectibleData.transaction_hash,

		 };
		const obj = {
			_id: redeemorder[i]._id,
			token_id : redeemorder[i].token_id,
			name: redeemorder[i].name,
			address: redeemorder[i].address,
			phone: redeemorder[i].phone,
			city: redeemorder[i].city,
			zip: redeemorder[i].zip,
			state: redeemorder[i].state,
			country: redeemorder[i].country,
			status: redeemorder[i].status,
			burn: redeemorder[i].burn,
			created_on: redeemorder[i].created_on,
			collectible_data: {...collectible_data}
		}

		redeemArr.push(obj);
		
        } catch (err) {
            console.log('err :',err);
            continue;
        }
    }
    return redeemArr;
}

exports.get = async (req, res) => {
	try { 
        const query = req.query;
        let { page_number } = query;
        // if (!network_id) throw new Error("Network Id is required");
		// if (network_id != 1 && network_id != 2) throw new Error("Network Id is invalid");
        if (!page_number) throw new Error("Page Number is Required");
		page_number = parseInt(page_number);
		if (page_number < 1) throw new Error("Page Number should not be less than 1");
		const skip_data = (page_number - 1) * 10;
		const params = {
			skip_data: skip_data
		}
		const redeemorder = await RedeemOrder.get(params);
        if (redeemorder.length === 0) throw new Error("Redeem order not found");
		if (redeemorder == null || redeemorder == undefined) throw new Error("Redeem order Not Found");
        const redeemData = await getDataFromBlockchain(redeemorder);
		return res.send(genRes.generateResponse(true, "Redeem order found successfully", 200, redeemData));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}

}

exports.updateStatus = async (req, res) => {
	try { 
        const redeemorder = req.body;
		if (!redeemorder) throw new Error("Invalid Parameter");
		const { _id, token_id, status } = redeemorder;
		if (!_id || _id == 'null' || _id == 'undefined') throw new Error("Invalid Parameter");
		if (!status || status == 'null' || status == 'undefined') throw new Error("Status is Required");
        const params = {
            status : status
        }
        const response = await RedeemOrder.update(_id, params);
		return res.send(genRes.generateResponse(true, "Redeem order update successfully", 200, response));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}


exports.updateBurn = async (req, res) => {
	try { 
        const redeemorder = req.body;
		if (!redeemorder) throw new Error("Invalid Parameter");
		const { _id, token_id, burn } = redeemorder;
		if (!_id || _id == 'null' || _id == 'undefined') throw new Error("Invalid Parameter");
		if (!burn || burn == 'null' || burn == 'undefined') throw new Error("Burn is Required");
        const params = {
            burn : burn
        }
        const response = await RedeemOrder.updateBurn(_id, params);
		return res.send(genRes.generateResponse(true, "Redeem order update successfully", 200, response));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}


