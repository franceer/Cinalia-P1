'use strict';

let LocalStrategy = require('passport-local').Strategy
    , BasicStrategy = require('passport-http').BasicStrategy
    , User = require('../models/user')
    , passport = require('passport')
	, checkit = require('checkit');

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

        // asynchronous
        // User.findOne wont fire unless data is sent back
        //process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
        User.findOne({ username: email }, {require: false}).then(function(user) {

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Cet email est déjà enregistré'));
                } else {

                    // if there is no user with that email
                    // create the user
                    User.create({ username: email, password: password, email: email, firstname: req.body.firstname, lastname: req.body.lastname })
                    .then(function (user) {
                        return done(null, user, req.flash('signupMessage', 'YEAH CREATED'));
                    })
					// .catch(User.ValidationError, function(err){
						// return done(null, false, req.flash('signupMessage', err.toJSON()));
					// })
                    .catch(function (err) {
                        return done(null, false, req.flash('signupMessage', err.message));
                    });
                }
            })
            .catch(function (err) {
                return done(null, false, req.flash('signupMessage', err.message));
            });
        //});
    }));

passport.use('local-signin', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.login(email, password).then(function (user) {
			return done(null, user);
        })
        .catch(User.NotFoundError, function () {
            return done(null, false, req.flash('signinMessage', 'Email incorrect')); // req.flash is the way to set flashdata using connect-flash
        })
        .catch(function (err) {
            return done(null, false, req.flash('signinMessage', err.message)); // create the loginMessage and save it to session as flashdata
        });
    }));

module.exports = passport;
module.exports.isAPIAuthenticated = passport.authenticate('api-auth', { session: false });
