var express = require('express'),
    router = express.Router();

router.get('/:id', function (req, res) {
    res.render('fashion-products/fashion-products');
});

module.exports = router