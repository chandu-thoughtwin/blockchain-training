const mongoose 	= require('mongoose');
const Schema = mongoose.Schema;

const RedeemOrderSchema = new Schema({
    // contract_address : {type: String, required: true, unique: true},
    token_id : {type: String, required: true, unique: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    city: {type: String, required: true},
    zip: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    status: {type: String, default: "pending"},
    burn: {type: Boolean, default: false},
	created_on: {type: Date, default: new Date}
});
module.exports = mongoose.model('redeemOrder', RedeemOrderSchema);