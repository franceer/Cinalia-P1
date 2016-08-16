'use strict';

let express = require('express'),
    router = express.Router(),
    Location = require('../models/location'),
    _ = require('lodash');

router.get('/:id', function (req, res) {
    Location.findById(req.params.id, { withRelated: ['videoMedias'], require: true })
    .then(function (location) {
        let locationTemp = location.toJSON();
        let reqVideoMediaId = req.query.mediaid;

        if (reqVideoMediaId) {
            locationTemp.sawIn = _.pickBy(locationTemp.videoMedias, checkVideoMedia)[0];
            locationTemp.videoMedias = _.omitBy(locationTemp.videoMedias, checkVideoMedia);

            function checkVideoMedia(videoMedia) {
                return videoMedia.id === parseInt(reqVideoMediaId);
            }
        }

        res.render('locations/locations', {location: locationTemp});
    })
    .catch(function (err) {
        return next(new Error(err));
    });
    //if (req.query.movieid) {
    //    ProductInMovie.forge({ product_id: req.params.id, video_media_id: req.query.movieid })
    //    .fetch({ withRelated: ['product', 'product.brand', 'product.type', 'product.videoMedias', 'videoMedia', 'matchingStatus'], require: true })
    //    .then(function (productInMovie) {
    //        let jSONObject = productInMovie.toJSON();
    //        let contextualInfo = { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }
    //        res.render('products/products', { product: jSONObject.product, contextualInfo: contextualInfo, media: jSONObject.videoMedia });
    //    })
    //    .catch(bookshelf.NotFoundError, function (err) {
    //        fetchProduct();
    //    })
    //    .catch(function (err) {
    //        return next(new Error(err));
    //    });
    //} else {
    //    fetchProduct();
    //}

    //function fetchProduct() {
    //    Product.forge({ id: req.params.id })
    //    .fetch({ withRelated: ['brand', 'type', 'videoMedias', 'matchingStatuses'], require: true })
    //    .then(function (product) {
    //        res.render('products/products', { product: product.toJSON() });
    //    })
    //    .catch(bookshelf.NotFoundError, function (err) {
    //        res.send("Not Found", 404);
    //    })
    //    .catch(function (err) {
    //        return next(new Error(err));
    //    });
    //}    
});

module.exports = router