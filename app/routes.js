var User = require('./models/user');

var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;
var bcrypt			= require('bcrypt-nodejs');

module.exports = function(app)
{
	// Login validation strategies using passport	
	var isValidPassword = function(user, password) {
		return bcrypt.compareSync(password, user.password);
	}
	
	var createHash = function(password){
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	}
	
	passport.use('login', new LocalStrategy(
		function(username, password, done) {
			console.log("LOGIN ROUTE HIT");
			User.findOne({ username : username },
				function(err, user) {
					
					if (err) {
						console.log("Error in login: ", err);
						return done(err);
					}
					
					if (!user) {
						console.log("User does not exist.");
						return done(null, false);
					}
					
					if (!isValidPassword(user, password)) {
						console.log("Invalid password.");
						return done(null, false);
					}

					return done(null, user);
				}
			);
		}
	));
	
	passport.use('signup', new LocalStrategy(
		{ passReqToCallback: true },
		function(req, username, password, done) {
			console.log("SIGNUP ROUTE HIT");
			User.findOne({ username : username },
				function(err, user) {
					
					if (err) {
						console.log("Error in login: ", err);
						return done(err);
					}
						
					if (user) {
						console.log("User already exists.");
						return done(null, false);
					}
					
					var newUser			= new User();
					newUser.username	= username;
					newUser.password	= createHash(password);
					newUser.firstname	= req.body.firstname;
					newUser.lastname	= req.body.lastname;
					newUser.email		= req.body.email;
					
					newUser.save(function(err) {
						if (err) {
							console.log("Error saving user: ", err);
							throw err;
						}
						console.log("User registration successful.");
						return done(null, newUser);
					});
				}
			);
		}
	));
	
	passport.serializeUser( function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser( function(id, done) {
	  User.findById(id, function(err, user) {
		done(err, user);
	  });
	});
	
	app.post('/login',
		passport.authenticate('login', { failureRedirect: '/' }),
			function (req, res) {
				console.log(req);
				console.log(res);
				res.redirect('/');
			}
	);
	
	app.post('/signup',
		passport.authenticate('signup', { successRedirect: '/',
										  failureRedirect: '/'
		})
	);
	
	// User API --------------------------------------------------------------------
	// GET all users
	app.get('/api/users', function(req, res) {
	
		User.find( function(err, users) {
			
			if (err) {
				console.log("GET all users failed with error: ", err);
				return res.send(err);
			}
			
			res.json(users);
		});
		
	});
	
	// GET user by name
	app.get('/api/users/:username', function(req, res) {
	
		User.findOne( { username : username}, function(err, user) {
			
			if (err) {
				console.log("GET user by name failed with error: ", err);
				return res.send(err);
			}
			
			res.json(user);
		});
		
	});
}