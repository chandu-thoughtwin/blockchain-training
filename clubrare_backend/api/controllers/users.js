'use strict';
const User = require('../models/users.js');
const genRes 	= require('./genres.js');
const _ 		= require('lodash');
const mongoose = require('mongoose');
// mongoose.set('debug', true)
// mongoose.set("useFindAndModify", false);

exports.create = async (params) => {
	try {
		const user = new User(params);
		const result = await user.save();
		return genRes.generateResponse(true,"User created successfully",200, result);
	} catch (error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}

exports.get = async (walletAddress) => {
	try {
		const query = {
			wallet_address: walletAddress
		}
		const result = await User.findOne(query,{ liked: 0, following: 0 }).exec();
		if(result && result!='null' && result!='undefined') {
			return genRes.generateResponse(true,"User found successfully",200, result);
		} else {
			return genRes.generateResponse(false,"User not found" ,400, null);
		}
		
	} catch(error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}

exports.getCoverImage = async (walletAddress) => {
	try {
		const query = {
			wallet_address: walletAddress
		}
		const result = await User.findOne(query,{ wallet_address: 1, cover_image: 1 }).exec();
		if(result && result!='null' && result!='undefined') {
			return genRes.generateResponse(true,"Found successfully",200, result);
		} else {
			return genRes.generateResponse(false,"Not found" ,400, null);
		}
	} catch(error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}


exports.update = async (wallet_address, params) => {
	try {
		params = _.omit(params, ['wallet_address', "$$hashKey"]);
		const query = {
			wallet_address: wallet_address
		}
		const result = await User.updateOne(query, params);
		return genRes.generateResponse(true,"User update successfully",200, null);
	} catch (error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}

exports.updateCoverImage = async (wallet_address, params) => {
	try {
		params = _.omit(params, ['wallet_address', "$$hashKey"]);
		const query = {
			wallet_address: wallet_address
		}
		const result = await User.updateOne(query, params);
		return genRes.generateResponse(true,"Cover image update successfully",200, null);
	} catch (error) {
		return genRes.generateResponse(false,"there occurred some error : "+error, 400, null);
	}
}

exports.getNameBasedOnWallet = async (walletAddress) => {
	const query = {
		wallet_address: walletAddress
	}
	const result = await User.findOne(query, { name: 1 }).exec();
	return result.name;
}

exports.getBasedOnWallet = async (walletAddress) => {
	const query = {
		wallet_address: walletAddress
	}
	const result = await User.findOne(query, { liked: 0, following: 0, __v:0 }).exec();
	return result;
}

exports.blockUser = async (block_to, params) => {
		params = _.omit(params, ['block_to', "$$hashKey"]);
		const query = {
			wallet_address: block_to
		}
		const updateQuery = {
			isBlock: params.isBlock,
			block_by: params.block_by
		}
		await User.updateOne(query, updateQuery);
}

exports.getAll = async (params) => {
		const { skip_data } = params; 
		const user = await User.find({},{image:1, name:1, isBlock:1, custom_url:1, wallet_address:1}).skip(skip_data).limit(10).exec();
		return user;
}


