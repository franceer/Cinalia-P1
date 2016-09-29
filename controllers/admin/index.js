var express = require('express'),
	router = express.Router();
  
router.use('/films', require('./movies'));
router.use('/produits', require('./products'));
router.use('/lieux', require('./locations'));
router.use('/categories', require('./categories'));
router.use('/looks', require('./looks'));
router.use('/decors', require('./sets'));

module.exports = router;