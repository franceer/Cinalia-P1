'use strict';

let LocalStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('../models/user'),
    passport = require('passport'),
	rp = require('request-promise');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
    .then(function (user) {
        done(null, user);
    })
    .catch(function (err) {
        done(err);
    });
});

passport.use('api-auth', new BasicStrategy({
    passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
        User.login(email, password)
        .then(function (user) {
            if(user.isAdmin())
                return done(null, user);

            return done(null, false);
        })       
        .catch(function (err) {
            return done(null, false);
        });
    }));
    
passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		
		if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			return done(null, false, req.flash('signupMessage', ['danger', 'Merci de sélectionner une image captcha']));
		  }
		  
		var secretKey = "6LcwZSgTAAAAAPtK3pvMYIjKj9UKyComh4-tZiCv";
		
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		var requestOptions = {
			form: {
				secret: secretKey,
				response: req.body['g-recaptcha-response'],
				remoteip: req.connection.remoteAddress // req.connection.remoteAddress will provide IP address of connected user.
			},
			method: 'POST',
			uri: 'https://www.google.com/recaptcha/api/siteverify',			
			json: true
		}
		rp(requestOptions)
		.then(function(body){
			if(body.success !== undefined && !body.success) 
				throw new Error('Vérification captcha échouée');  
			
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			return User.findOne({ username: email }, {require: false})
		})		
		.then(function(user) {
			// check to see if theres already a user with that email
			if (user)
				throw new Error('Cet email est déjà enregistré');
			
			// if there is no user with that email, create the user
			User.create({ username: email, password: password, email: email, firstname: req.body.firstname, lastname: req.body.lastname })
			.then(function (user) {
				return done(null, user, req.flash('signupMessage', ['success', 'Félicitations vous avez créé votre compte avec succès et pouvez maintenant profiter pleinement de pickedin.com']));
			})				
			.catch(function (err) {
				throw new Error( err.message); 
			});			
		})
		.catch(function (err) {
			return done(null, false, req.flash('signupMessage', ['danger', err.message]));
		});
    }));

passport.use('local-signin', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.login(email, password)
		.then(function (user) {
			return done(null, user);
        })
        .catch(User.NotFoundError, function () {
            return done(null, false, req.flash('signinMessage', ['danger', 'Email incorrect'])); 
        })
        .catch(function (err) {
            return done(null, false, req.flash('signinMessage', ['danger', err.message]));
        });
    }));

module.exports = passport;
module.exports.isAPIAuthenticated = passport.authenticate('api-auth', { session: false });
