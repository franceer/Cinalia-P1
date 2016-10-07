var express = require('express'),
	router = express.Router();
  
router.use('/films', require('./movies'));
router.use('/produits', require('./products'));
router.use('/lieux', require('./locations'));
//router.use('/categories', require('./categories'));
router.use('/tags', require('./tags'));
router.use('/looks', require('./looks'));
router.use('/personnages', require('./characters'));
router.use('/decors', require('./sets'));

module.exports = router;