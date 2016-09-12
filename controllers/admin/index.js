var express = require('express'),
	router = express.Router();
  
router.use('/films', require('./movies'));
router.use('/produits', require('./products'));

module.exports = router;