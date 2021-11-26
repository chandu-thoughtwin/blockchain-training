const genRes = require('../controllers/genres.js');
const Collection = require('../controllers/collections.js');

exports.create = async (req, res) => {
	try {
        const collection = req.body;
		if (!collection) throw new Error("Invalid Parameter");
		const { wallet_address, contract_address } = collection;
		if (!wallet_address || wallet_address == 'null' || wallet_address == 'undefined') throw new Error("Wallet Address is Required");
		if (!contract_address || contract_address == 'null' || contract_address == 'undefined') throw new Error("Contract Address is Required");

		await Collection.create(collection);
		return res.send(genRes.generateResponse(true, "Collection successfully create", 200, null));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

exports.get = async (req, res) => {
	try { 
        const query = req.query;
		const collection = await Collection.get(query);
		if (collection == null || collection == undefined) throw new Error("Collection Not Found");
		return res.send(genRes.generateResponse(true, "Collection found successfully", 200, collection));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}

}