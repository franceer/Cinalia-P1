var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport');

router.get('/', function(req, res, next){
	req.logout();
	res.redirect('/');
});

module.exports = router