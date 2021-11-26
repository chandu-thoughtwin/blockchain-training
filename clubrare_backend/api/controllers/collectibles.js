'use strict';
const Collectible	= require('../models/collectibles.js');
const User = require('../models/users.js');
const genRes 	= require('./genres.js');
const _ 		= require('lodash');

// const mongoose = require('mongoose');
// mongoose.set('debug', true);

exports.create = async (params) => { 
    const collectible = new Collectible(params);
	const result = await collectible.save();
    return result;
}

exports.getBasenOnToken = async (token) => {
	try {
		const query = {
			token: token
		}
		const result = await Collectible.findOne(query,{title:1, description:1}).exec();
		if(result && result!='null' && result!='undefined') {
			return genRes.generateResponse(true,"Found successfully",200, result);
		} else {
			return genRes.generateResponse(false,"Not found" ,400, null);
		}
	} catch(error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}

/** function used join  */
exports.getUserName = async (token) => {
	try {
		token = Number(token);
	 	const result = await Collectible.aggregate([{$match: {token: token}},
			{$lookup: {from: "users", localField: "wallet_address", foreignField: "wallet_address", as: "userObj"}},
			 {$unwind: "$userObj"}, {$project: {"userObj.name": 1, "userObj.image": 1, "userObj.wallet_address": 1}}]).exec();
		if(result && result!='null' && result!='undefined') {
			return genRes.generateResponse(true,"Found successfully",200, result);
		} else {
			return genRes.generateResponse(false,"Not found" ,400, null);
		}
	} catch(error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}


exports.update = async (id, params) => {
		params = _.omit(params, ['_id', "$$hashKey"]);
		const result = await Collectible.updateOne({_id: id}, params);
		return result;
}


exports.getRedeemable = async () => {
		const query = {
			redeemable: true
		}
		const result = await Collectible.find(query).sort({created_on : -1 }).exec();
		return result;
}

exports.get = async (query) => {
	const result = await Collectible.findOne(query).exec();
	return result;
}