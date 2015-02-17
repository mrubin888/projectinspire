console.log("Server.js");

// Setup
var express		= require('express');
var app			= express();
var mongoose	= require('mongoose');
var multer		= require('multer');

var passport	= require('passport');
var mongoStore	= require('express-session-mongo');

// configuration
var username	= 'mrubin';
var password	= 'shock!5129';
mongoose.connect('mongodb://' + username + ':' + password + '@proximus.modulusmongo.net:27017/ezaviR2i'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
			
	app.use(express.static(__dirname + '/public'));	
	app.use('/bower_components', express.static(__dirname + '/bower_components'));		// set the static file location
	app.use('/extern', express.static(__dirname + '/extern'));		// set the static file location
	app.use(express.logger('dev'));														// log requests to the console
	app.use(express.json());
	app.use(express.urlencoded());													// pull html info in POST
	app.use(express.methodOverride());
	//app.use(express.cookieParser());
	app.use(express.session({	secret	: 'asd87681ASD',
								store	: new mongoStore(),
								cookie	: {
									maxAge : 60 * 60 * 24 * 30
								}
							}));
	app.use(multer({
		dest: './static/uploads/',
		rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase();
		}
	}));	
	app.use(passport.initialize());
	app.use(passport.session());
});

require('./app/routes.js')(app);

// listen
var portNo = process.env.PORT || 8001;
app.listen(portNo);
console.log("App listening on port " + portNo);