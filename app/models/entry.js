var mongoose = require("mongoose");

module.exports = mongoose.model('Entry', {
	timestamp	: Date,
	title		: String,
	contentType	: String,
	content		: String
});