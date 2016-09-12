var express = require('express'),
    router = express.Router(),
    helper = require('../../helpers/helper'),
    Promise = require('bluebird'),
    Category = require('../../models/category'),
    Product = require('../../models/product'),
    Brand = require('../../models/brand'),
    moment = require('moment'),
    fs = require('fs'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let currentPage = req.query.p ? req.query.p : 1;

    Promise.all([Brand.fetchAll(), Product.orderBy('updated_at').fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: ['brand', 'parentProduct', 'parentProduct.brand', 'similarProducts', 'similarProducts.brand', 'categories'] })])
    .then(function (results) {
        var brands = results[0];
        var products = results[1];       
        products.pagination.data = helper.getPaginationData(products.pagination.rowCount, products.pagination.pageSize, 10, products.pagination.page);
        res.render('admin/products', { brands: brands.toJSON(), products: products.toJSON(), pagination: products.pagination, moment: moment });        
    });    
})
.get('/categories', function (req, res) {
    Category.searchCategories(req.query.q, req.query.page)
    .then(function (results) {
        var jSONResults = results.toJSON();
        var data = [];

        jSONResults.forEach(function (category) {
            data.push({ id: category.id, text: category.name + '(' + category.path + ')' });
        });
        res.json({items: data, total_count: results.pagination.rowCount});
    });
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
    });

    var categoriesIDs = req.body.categories;
    delete req.body.categories;    

    Product.findOne({ id: req.params.id }, { require: false }).then(function (oldProduct) {
        if (oldProduct.get('picture_url') !== req.body.picture_url) {
            var index1 = oldProduct.get('picture_url').indexOf(process.env.NODE_ENV);
            var index2 = oldProduct.get('picture_url').lastIndexOf('/');

            return helper.deleteS3Objects(oldProduct.get('picture_url').substring(index1, index2))
            .then(function (deleted) {
                return helper.uploadImagesToS3(req, 'picture_url', ['name', 'brand_name']);
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
    .then(function (product) {
        return Promise.all([Brand.fetchAll(), product.load(['brand', 'parentProduct', 'parentProduct.brand', 'similarProducts', 'similarProducts.brand', 'categories'])]);
    })
    .then(function (results) {
        var brands = results[0];
        var product = results[1];
        res.render('partials/admin-product-line', { layout: false, moment: moment, brands: brands.toJSON(), product: product.toJSON() });
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {
    var categoriesIDs = req.body.categories;
    delete req.body.categories;

    helper.uploadImagesToS3(req, 'picture_url', ['name', 'brand_name'])
    .then(function(files){
        var originalURL;

        files.forEach(function(file){
            if(file.Location.indexOf('original') !== -1)
                originalURL = file.Location;
        });

        req.body.picture_url = originalURL;

        if (!req.body.picture_alt || req.body.picture_alt.length === 0)
            req.body.picture_alt = req.body.brand_name + ' ' + req.body.name;

        if (!req.body.picture_title || req.body.picture_title.length === 0)
            req.body.picture_title = req.body.picture_alt;

        delete req.body.brand_name;
        return Product.create(req.body);
    })
    .then(function (product) {
        var returned = null;

        if (categoriesIDs)
            returned = product.categories().attach(categoriesIDs);

        return returned;       
    })
    .then(function (product) {
        res.json({ status: 'success', data: product.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function(req, res){
    Product.destroy({ id: req.params.id })
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;