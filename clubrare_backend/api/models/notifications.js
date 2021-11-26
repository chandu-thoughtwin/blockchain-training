const mongoose 	= require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    wallet_address : {type: String, required: true, unique: true},
    notifications: [{
        title: {type: String},
        data: {type: String},
        content: {type: String},
        status: {type: String, default: "unread"}, // read or unread
        created_on: {type: Date, default: new Date}
    }],
	created_on: {type: Date, default: new Date}
});

module.exports = mongoose.model('notification', NotificationSchema);