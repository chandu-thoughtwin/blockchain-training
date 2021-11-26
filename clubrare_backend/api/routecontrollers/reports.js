const genRes = require('../controllers/genres.js');
//const mongoose = require('mongoose');
const Report = require('../controllers/reports.js');

exports.create = async (req, res) => {
	const report = req.body;
	try {
		if (!report) throw new Error("Invalid Parameter");
		const { reason, report_to, report_by } = report;
		if (!reason || reason == 'null' || reason == 'undefined') throw new Error("Reason is Required");
		if (!report_to || report_to == 'null' || report_to == 'undefined') throw new Error("Reported To is Required");
		if (!report_by || report_by == 'null' || report_by == 'undefined') throw new Error("Reported By is Required");

		await Report.create(report);
		return res.send(genRes.generateResponse(true, "Report successfully create", 200, null));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}
}

exports.getWithUserInfo = async (req, res) => {
	try {
		//console.log(req.headers);
		const report = await Report.getWithUserInfo();
		if (report == null || report == undefined) throw new Error("Report Not Found");
		return res.send(genRes.generateResponse(true, "Report found successfully", 200, report));
	} catch (error) {
		return res.send(genRes.generateResponse(false, error.message, 400, null));
	}

}