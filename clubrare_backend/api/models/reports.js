const mongoose 	= require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reason : {type: String, required: true}, // will contain message
    report_to: {type: String, required: true}, // report_to will contain wallet_address
    report_by: {type: String, required: true}, // report_by will contain wallet_address
	created_on: {type: Date, default: new Date}
});

module.exports = mongoose.model('report', ReportSchema);