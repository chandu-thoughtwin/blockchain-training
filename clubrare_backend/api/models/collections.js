const mongoose 	= require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    wallet_address : {type: String, required: true},
    contract_address: {type: String, requires: true}, // blockchain
	created_on: {type: Date, default: new Date}
});

module.exports = mongoose.model('collection', CollectionSchema);