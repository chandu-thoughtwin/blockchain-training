const mongoose 		= require('mongoose');
const Schema 			= mongoose.Schema;
// const ObjectId 		= Schema.ObjectId;

const UserSchema = new Schema({
	wallet_address: {type: String, required: true, unique: true},
	name: {type: String},
	custom_url: {type: String},
	bio: {type: String},
	twitter_username: {type: String},
	portfolio: {type: String},  // will contain website url
	email: {type: String},
	image: {type: String}, // ipfs url
	cover_image: {type: String}, // ipfs url
	liked: [{token:{type: String}}],
	role: { type: String, default: "user"}, // user/admin
	//following: [{ wallet_address:{type: String}}],
	following: [],  // it will contain wallet address
	isBlock: {type: Boolean, default: false},
	block_by: {type: String}, // will contain admin wallet address
	created_on: {type: Date, default: new Date}
});

module.exports = mongoose.model('user', UserSchema);