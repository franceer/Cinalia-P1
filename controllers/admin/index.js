var express = require('express'),
	router = express.Router();
  
router.use('/films', require('./movies'));
router.use('/produits', require('./products'));
router.use('/categories', require('./categories'));

module.exports = router;