var express = require('express'),
    router = express.Router(),
    helper = require('../../helpers/helper'),
    Promise = require('bluebird'),
    Product = require('../../models/product'),
    Products = require('../../collections/products'),
    Brand = require('../../models/brand'),
    moment = require('moment'),
    fs = require('fs'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let currentPage = req.query.p ? req.query.p : 1;

    Promise.all([Brand.fetchAll(), Product.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: ['brand', 'parentProduct', 'parentProduct.brand', 'similarProducts', 'similarProducts.brand', 'tags'] })])
    .then(function (results) {
        var brands = results[0];
        var products = results[1];       
        products.pagination.data = helper.getPaginationData(products.pagination.rowCount, products.pagination.pageSize, 10, products.pagination.page);
        res.render('admin/products', { brands: brands.toJSON(), products: products.toJSON(), pagination: products.pagination, moment: moment });        
    });    
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'brand_id')
            req.body[key] = req.body[key][0];
    });

    var tagsIDs = req.body.tags;
    delete req.body.tags;
    var product;

    Product.findOne({ id: req.params.id }, { require: false }).then(function (oldProduct) {
        if (oldProduct.get('picture_url') !== req.body.picture_url) {
            var index1 = oldProduct.get('picture_url').indexOf(process.env.NODE_ENV);
            var index2 = oldProduct.get('picture_url').lastIndexOf('/');

            return helper.deleteS3Objects(oldProduct.get('picture_url').substring(index1, index2))
            .then(function (deleted) {
                return helper.uploadImagesToS3(req, 'picture_url', ['name', 'brand_name'], 'products');
            });
        } else {
            return null;
        }        
    })
    .then(function (files) {
        if (files !== null) {
            var originalURL;

            files.forEach(function (file) {
                if (file.data.Location.indexOf('original') !== -1)
                    originalURL = file.data.Location;
            });

            req.body.picture_url = originalURL;
        }

        if (!req.body.picture_alt || req.body.picture_alt.length === 0)
            delete req.body.picture_alt;

        if (!req.body.picture_title || req.body.picture_title.length === 0)
            delete req.body.picture_title;

        delete req.body.brand_name;
        return Product.update(req.body, { id: req.params.id });
    })
    .then(function (updatedProduct) {
        product = updatedProduct;
        var returned = null;

        if (tagsIDs) {
            returned = product.tags().detach().then(function () {
                return product.tags().attach(tagsIDs);
            });
        }

        return returned;
    })
    .then(function () {
        return Promise.all([Brand.fetchAll(), product.load(['brand', 'parentProduct', 'parentProduct.brand', 'similarProducts', 'similarProducts.brand', 'tags'])]);
    })
    .then(function (results) {
        var brands = results[0];
        var updatedProduct = results[1];
        res.render('admin/partials/product-row', { layout: false, moment: moment, brands: brands.toJSON(), product: updatedProduct.toJSON() });
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'brand_id')
            req.body[key] = req.body[key][0];
    });

    var tagsIDs = req.body.tags;
    delete req.body.tags;
    var product;

    Brand.findOne({ name: req.body.brand_name }, {require: false})
    .then(function (brand) {
        var returned = null;

        if (!brand)
            returned = Brand.create({ name: req.body.brand_name });

        return returned;        
    })
    .then(function () {
        return helper.uploadImagesToS3(req, 'picture_url', ['name', 'brand_name'], 'products');
    })
    .then(function(files){
        var originalURL;

        files.forEach(function(file){
            if(file.data.Location.indexOf('original') !== -1)
                originalURL = file.data.Location;
        });

        req.body.picture_url = originalURL;

        if (!req.body.picture_alt || req.body.picture_alt.length === 0)
            req.body.picture_alt = req.body.brand_name + ' ' + req.body.name;

        if (!req.body.picture_title || req.body.picture_title.length === 0)
            req.body.picture_title = req.body.picture_alt;

        delete req.body.brand_name;
        return Product.create(req.body);
    })
    .then(function (addedProduct) {
        product = addedProduct;
        var returned = null;

        if (tagsIDs)
            returned = product.tags().attach(tagsIDs);

        return returned;       
    })
    .then(function () {
        return Promise.all([Brand.fetchAll(), product.load(['brand', 'parentProduct', 'parentProduct.brand', 'similarProducts', 'similarProducts.brand', 'tags'])]);
    })
    .then(function (results) {
        var brands = results[0];
        var product = results[1];
        res.render('admin/partials/product-row', { layout: false, moment: moment, brands: brands.toJSON(), product: product.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function (req, res) {
    Product.findOne({ id: req.params.id })
    .then(function (product) {
        var index1 = product.get('picture_url').indexOf(process.env.NODE_ENV);
        var index2 = product.get('picture_url').lastIndexOf('/');

        return helper.deleteS3Objects(product.get('picture_url').substring(index1, index2))
        .catch(function (err) { /*Do nothing in case the images doesn't exist anymore*/ })
        .then(function () {
            return Product.destroy({ id: req.params.id });
        });
    })
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;