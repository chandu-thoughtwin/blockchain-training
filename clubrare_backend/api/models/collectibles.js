const mongoose 		= require('mongoose');
const Schema 			= mongoose.Schema;
// const ObjectId 		= Schema.ObjectId;

const CollectibleSchema 	= new Schema({
    wallet_address: {type: String, required: true}, //acount[1]
    token_id: {type: String},
	file: {type: String}, //ipfs
    fixed_price: {type: Number},
    redeemable: {type: Boolean, default: false},
    redeem_verified: {type: Boolean, default: false},
    redeem_type: {type: String}, // 1: not burn ,2: burnable
    transaction_hash : {type: String},
    collection_address: {type: String},
    english_auction: {type: String},
    vitalhint_collection: {type: String}, // confirm from client side
    title: {type: String},
    description: {type: String},
    royalties: {type: Number},
    properties: {
        size: {type: String},
        m: {type: String}
    },
    number_of_copies: {type: Number},
    is_multiple: {type: Boolean, default: false},
    marketplace_type: {type: String},
    put_on_marketplace: {type: Boolean, default: false},
    timed_auction: {
        minimum_bid: {type: Number},
        start_date: {type: Date},
        end_date: {type: Date}
    },
    unlimited_auction: {type: Boolean, default: false},
    unlock_purchased: {type: Boolean, default: false},
    digital_key_for_unlock_purchased: {type: String},
    collection_id: {type: String},
    alternative_text_for_NFT: {type: String},
    on_sale: {type: Boolean, default: false},
    created_on: {type: Date, default: new Date}

});
module.exports = mongoose.model('collectible', CollectibleSchema);
