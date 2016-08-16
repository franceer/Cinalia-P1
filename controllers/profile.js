'use strict';

let express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
	if(!req.isAuthenticated())
		res.redirect('/');   

    res.render('profile/profile');      
});

module.exports = router