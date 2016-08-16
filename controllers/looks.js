'use strict';

let express = require('express'),
    router = express.Router(),
    ProductsInLook = require('../models/products-in-look'),
    Look = require ('../models/look'),
    _ = require('lodash');

router.get('/:id', function (req, res) {
    Look.findById(req.params.id, { withRelated: ['videoMedia'] })
    .then(function (look) {
        res.locals.look = look.toJSON();
        return ProductsInLook.findAll({ look_id: req.params.id }, { withRelated: ['product', 'product.brand', 'bodyLocation', 'matchingStatus'] });
    })
    .then(function (productsInLook) {
        let products = _.groupBy(productsInLook.toJSON(), function (productInLook) {
            return productInLook.bodyLocation.name;
        });
        
        res.render('looks/looks', { products: products });
    });      
});

module.exports = router