var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport');

router.get('/', function(req, res, next){
    req.logout();
    req.session.destroy(function (err) {
        res.redirect(req.headers.referer);
    });    
});

module.exports = router