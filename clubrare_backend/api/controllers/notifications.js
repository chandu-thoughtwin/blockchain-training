'use strict';
const Notification = require('../models/notifications.js');
const genRes 	= require('./genres.js');

exports.create = async (params) => { 
    const notification = new Notification(params);
	await notification.save();
}

exports.get = async (wallet_address) => {
		const query = {
			wallet_address: wallet_address
		}
		const notification = await Notification.findOne(query).exec();
        return notification;
}


exports.updateNotification = async (wallet_address,updateNotifi) => {
		const query = {
			wallet_address: wallet_address
		}
		const updateDocument = {
			notifications: updateNotifi
		}
		await Notification.updateOne(query, updateDocument);
}
