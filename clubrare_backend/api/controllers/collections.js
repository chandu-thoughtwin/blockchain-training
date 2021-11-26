'use strict';
const Collection = require('../models/collections.js');

exports.create = async (params) => {
    const collection = new Collection(params);
    await collection.save();
}

exports.get = async (query) => {
    const collection = await Collection.findOne(query).exec();
    return collection;
}