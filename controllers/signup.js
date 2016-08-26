var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport');

//router.post('/', passport.authenticate('local-signup', {
//	successRedirect: '/', // redirect to the secure profile section
//	failureRedirect: '/', // redirect back to the signup page if there is an error
//	failureFlash: true // allow flash messages
//}));

router.post('/', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err || !user) {
            req.session.save(function (err) {
                return res.redirect(req.headers.referer);
            });
        } else {
            req.logIn(user, function (err) {
                if (err)
                    return next(err);
                // Redirect if it succeeds           
                req.session.save(function (err) {
                    return res.redirect(req.headers.referer);
                });
            });
        }
    })(req, res, next);
});

module.exports = router