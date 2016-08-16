'use strict';

let express = require('express'),
    router = express.Router(),
    ProductsInSet = require('../models/products-in-set'),
    Set = require('../models/set');

router.get('/:id', function (req, res) {
    Set.findById(req.params.id, { withRelated: ['videoMedia'] })
    .then(function (set) {
        res.locals.set = set.toJSON();
        return ProductsInSet.findAll({ set_id: req.params.id }, { withRelated: ['product', 'product.brand', 'matchingStatus'] });
    })
    .then(function (productsInSet) {
        res.render('sets/sets', { products: productsInSet.toJSON() });
    });
});

module.exports = router