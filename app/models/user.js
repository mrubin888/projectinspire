var mongoose = require("mongoose");

module.exports = mongoose.model('User', {
	username	: String,
	password	: String,
	firstname	: String,
	lastname	: String,
	email		: String
});