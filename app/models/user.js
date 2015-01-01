var mongoose = require("mongoose");

module.exports = mongoose.model('User', {
	firstname	: String,
	lastname	: String,
	username	: String,
	password	: String,
	email		: String
});