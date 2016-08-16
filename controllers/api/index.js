var express = require('express')
  , router = express.Router();
  
router.use('/users', require('./users'));
//router.use('/products', require('./products'));
//router.use('/locations', require('./locations'));
//router.use('/sets', require('./sets'));
//router.use('/looks', require('./looks'));

module.exports = router