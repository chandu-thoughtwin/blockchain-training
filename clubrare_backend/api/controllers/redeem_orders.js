'use strict';
const RedeemOrder = require('../models/redeem_orders.js');
const genRes 	= require('./genres.js');

exports.create = async (params) => { 
    const redeemorder = new RedeemOrder(params);
	await redeemorder.save();
}

exports.get = async (params) => {
		const { skip_data } = params; 
		const redeemorder = await RedeemOrder.find().sort({created_on : -1 }).skip(skip_data).limit(10).exec();
        return redeemorder;
}

exports.update = async (id, params) => {
		const updateDocument = {
			status: params.status
		}
		const redeemorder = await RedeemOrder.findByIdAndUpdate(id, updateDocument);
		return redeemorder;
}

exports.updateBurn = async (id, params) => {
	const updateDocument = {
		burn: params.burn
	}
	const redeemorder = await RedeemOrder.findByIdAndUpdate(id, updateDocument);
	return redeemorder;
}

exports.getStatusOnToken = async (token) => {
		const query = {
			token_id: token
		}
		const result = await RedeemOrder.findOne(query, {status: 1}).exec();
		return result;
}