var express = require('express'),
	router = express.Router(),
	helper = require('../helpers/helper');
  
router.get('/', function (req, res) {   
	res.render('index');
});

router.use('/api', require('./api'));
router.use('/admin', require('./admin'));
router.use('/movies', require('./movies'));
router.use('/products', require('./products'));
router.use('/locations', require('./locations'));
router.use('/sets', require('./sets'));
router.use('/looks', require('./looks'));
router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));
router.use('/logout', require('./logout'));
router.use('/search', require('./search'));
router.use('/profile', require('./profile'));
router.use('/save-bookmark', require('./save-bookmark'));
router.use('/like', require('./like'));
router.use('/mentions-legales', require('./legal'));
router.use('/mdp-oublie', require('./forgot'));
router.use('/reset', require('./reset'));
router.use('/contact', require('./contact'));

module.exports = router