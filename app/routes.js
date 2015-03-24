var User	= require('./models/user');
var Entry	= require('./models/entry');

var mongoose		= require('mongoose');
var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;
var bcrypt			= require('bcrypt-nodejs');

module.exports = function(app) {

	var fs = require('fs');
	
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('awsconfig.json');
	var s3 = new AWS.S3();
	var BUCKET = "projectinspire-dev";
	
	// Login validation strategies using passport	
	var isValidPassword = function(user, password) {
		return bcrypt.compareSync(password, user.password);
	}
	
	var createHash = function(password){
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	}
	
	passport.use('login', new LocalStrategy(
		function(username, password, done) {
		
			User.findOne({ username : username },
				function(err, user) {
					
					if (err) {
						return done (err);
					}
					
					if (!user) {
						return done (null, false);
					}
					
					if (!isValidPassword (user, password)) {
						return done (null, false);
					}
					
					return done(null, user);
				}
			);
		}
	));
	
	passport.use('signup', new LocalStrategy(
		{ passReqToCallback: true },
		function (req, username, password, done) {
		
			User.findOne({ username : username },
				function (err, user) {
					
					if (err) {
						console.log ("Error in login: ", err);
						return done (err);
					}
						
					if (user) {
						console.log ("User already exists.");
						return done (null, false);
					}
					
					var user			= new User ();
					user.username		= username;
					user.password		= createHash (password);
					user.firstname		= req.body.firstname;
					user.lastname		= req.body.lastname;
					user.email			= req.body.email;
					
					user.save( function (err) {
						if (err) {
							return done (err);
						}
						
						return done (null, user);
					});
				}
			);
		}
	));
	
	passport.serializeUser( function(user, done) {
		done(null, user.id);
	});
	 
	passport.deserializeUser( function (id, done) {
		User.findById(id, function (err, user) {
			done (err, user);
	  });
	});
	
	app.post('/login', function (req, res, next) {
		passport.authenticate('login', function (err, user, info) {
		
			if (err) {
				return next (err);
			}
			
			console.log(user);
			
			if (!user) {
				return res.send (401);
			}
			
			req.login (user, function (err) {
				if (err)
					return next (err);
					
				return res.json (true);
			});
						
		})(req, res, next);
	});
	
	app.post ('/signup', function (req, res, next) {
		passport.authenticate ('signup', function (err, user, info) {
		
			if (err) {
				return next (err);
			}
			
			if (!user) {
				return res.send (401);
			}
			
			req.login (user, function (err) {
				if (err)
					return next (err);
					
				return res.json (true);
			});
			
		})(req, res, next);
	});
	
	app.get ('/logout', function (req, res) {
		req.logout ();
		res.json (true);
	});
	
	function requiresAuth (req, res, next) {
		console.log ("AUTHENTICATING...");
		if (req.isAuthenticated()) {
			console.log ("AUTHENTICATED.");
			return next ();
		}
		
		res.statusCode = 401;
		
		res.json (true);
	}
	
	// User API --------------------------------------------------------------------
	// GET all users
	app.get('/api/users', requiresAuth, function(req, res) {
	
		User.find( function(err, users) {
			
			if (err) {
				return res.send (err);
			}
			
			res.json (users);
		});
		
	});
	
	// GET session user
	app.get('/api/users/session', requiresAuth, function(req, res) {
	
		res.json (req.user);
		
	});
	
	// GET user by name
	app.get('/api/users/:username', requiresAuth, function(req, res) {
	
		User.findOne( { username : username }, function(err, user) {
			
			if (err) {
				console.log("GET user by name failed with error: ", err);
				return res.send(err);
			}
			
			res.json(user);
		});
		
	});
	
	// Entry API --------------------------------------------------------------------
	// GET all entries
	app.get('/api/entries', requiresAuth, function(req, res) {
	
		Entry.find( function(err, entries) {
			
			if (err) {
				return res.send (err);
			}
			
			res.json (entries);
		});
		
	});
	
	// POST new entry
	app.post('/api/entries', requiresAuth, function(req, res) {
		
		if (req.body.contentType === "text") {
			Entry.create({
				timestamp	: Date(),
				title		: req.body.title,
				content		: req.body.content,
				contentType	: req.body.contentType
			}, function(err, entry) {
			
				if (err)
					return res.send(err);
				
				res.json(entry);
			});
		}
		else if (req.body.contentType === "image") {
			var image	= req.files["content"];
			
			console.log (image);
			console.log (req.files);
			
			if (!image)
				return res.send (400);
			
			fs.readFile (image.path, function (err, data) {
			
				if (err) {
					return res.send (err);
				}
				
				s3.putObject({ Bucket: BUCKET + "/entries", Key: image.name, Body: data}, function(err, data) {
				
					if (err) {
						res.send (err);
					}
					
					var url = "https://s3-us-west-1.amazonaws.com/" + BUCKET + "/entries/" + image.name;
					
					Entry.create({
						timestamp	: Date(),
						title		: req.body.title,
						content		: url,
						contentType	: req.body.contentType
					}, function(err, entry) {
					
						if (err)
							return res.send(err);
						
						res.json(entry);
					});
				});
			});
		}
	});
	
	// POST new entry (image)
	app.post('/api/upload', function(req, res) {
		var file = req.files["file"];
		var username = req.body.username;
		
		console.log("HIT");
		
		if(!file)
			return res.end(400);
		fs.readFile(file.path, function(err, data)	{
			if(err)
				return res.send(err);
			s3.putObject({ Bucket: BUCKET + "/pics", Key: file.name, Body: data}, function(err, data) {
				
				console.log("S3: ", data);
				
				if(err)
					console.log(err);
				
				var url = "https://s3-us-west-1.amazonaws.com/" + BUCKET + "/pics/" + file.name;
				console.log(url);
				User.update({
					name : username
				},
				{$set: {profPicUrl : url}},
				function(err, numHits) {
					console.log("1");
					if(err)	{
						console.log(err);
						return res.send(err);
					}
					
					if(!numHits) {
						console.log("No user found.");
						return res.send("No user found");
					}
					
					User.findOne({name : username}, function(err, user) {
						console.log("2");
						if(err)
							return res.send(err);
							
						res.json(user);
					});
					
				});
			});
		});
	});
	
	app.delete('/api/entry/:id', requiresAuth, function(req, res) {
	
		console.log(req.params.id);
		
		Entry.remove({ _id : req.params.id }, function (err, num) {
			
			console.log(num);
			
			if (err) {
				return res.send(err);
			}
			
			console.log(3);
			res.json (num);
		});
	});
}