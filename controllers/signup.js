var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport');

router.post('/', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

module.exports = router