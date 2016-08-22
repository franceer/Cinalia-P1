var express = require('express')
  , router = express.Router();
  
router.get('/', function (req, res) {   
	var tempFlash = req.flash(); 
	var message = {};
	
	if(tempFlash.signinMessage){
		message.type = 'signin';
		message.message = tempFlash.signinMessage;
	}
	else if(tempFlash.signupMessage){
		message.type = 'signup';
		message.message = tempFlash.signupMessage;
	}
	
	res.render('index2', { message: message});
});
router.use('/api', require('./api'));
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

module.exports = router