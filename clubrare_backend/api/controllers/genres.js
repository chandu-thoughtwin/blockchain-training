exports.generateResponse = function(status, message, code, data){
	var response = {
		status : status,
		message : message,
		code : code,
		data : data
	}
	return JSON.stringify(response);
}