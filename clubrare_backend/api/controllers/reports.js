'use strict';
const Report = require('../models/reports.js');
const genRes = require('./genres.js');
// const _ 		= require('lodash');
// const mongoose = require('mongoose');
// mongoose.set('debug', true)
// mongoose.set("useFindAndModify", false);

exports.create = async (params) => {
    const report = new Report(params);
    await report.save();
}

exports.getWithUserInfo = async () => {
    const report = await Report.aggregate([
        { $lookup: { from: "users", localField: "report_to", foreignField: "wallet_address", as: "reportToObj" } },
        { $unwind: "$reportToObj" },
        { $lookup: { from: "users", localField: "report_by", foreignField: "wallet_address", as: "reportByObj" } },
        { $unwind: "$reportByObj" }, { $project: { "reason":1, "report_by":1, "report_to":1,"reportToObj.name": 1, "reportToObj.image": 1, "reportByObj.name": 1, "reportByObj.image": 1 } }]).exec();

    return report;
}