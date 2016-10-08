var express = require('express'),
    router = express.Router(),
    helper = require('../../helpers/helper'),
    Promise = require('bluebird'),
    Look = require('../../models/look'),
    Product = require('../../models/product'),
    moment = require('moment'),
    fs = require('fs'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let currentPage = req.query.p ? req.query.p : 1;

    Look.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: ['tags', 'products', 'products.brand', 'characterType'] })
    .then(function (looks) {          
        looks.pagination.data = helper.getPaginationData(looks.pagination.rowCount, looks.pagination.pageSize, 10, looks.pagination.page);
        res.render('admin/looks', { looks: looks.toJSON(), pagination: looks.pagination, moment: moment });
    });    
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;        
    });

    var tagsIDs = req.body.tags;
    var products = req.body.products;
    delete req.body.tags;
    delete req.body.products;
    var look;
    
    Look.update(req.body, { id: req.params.id })
    .then(function (updatedLook) {
        look = updatedLook;
        var promises = [];
        
        promises.push(look.tags().detach().then(function () {
            if (tagsIDs)
                return look.tags().attach(tagsIDs);            
        }));

        promises.push(look.products().detach().then(function () {
            if (products) {
                products.forEach(function (product) {
                    if (product.appearing_context === '')
                        product.appearing_context = null;                    
                });

                return look.products().attach(products);
            }                
        }));        

        return Promise.all(promises);
    })
    .then(function () {
        return look.load(['tags', 'products', 'products.brand', 'characterType']);
    })
    .then(function (updatedLook) {
        res.render('admin/partials/look-row', { layout: false, moment: moment, look: updatedLook.toJSON() });
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
    });

    var tagsIDs = req.body.tags;
    var products = req.body.products;
    delete req.body.tags;
    delete req.body.products;
    var look;

    Look.create(req.body)
    .then(function (addedLook) {
        look = addedLook;
        var promises = [];

        if (tagsIDs) 
            promises.push(look.tags().attach(tagsIDs));        

        if (products) {
            products.forEach(function (product) {
                if (product.appearing_context === '')
                    product.appearing_context = null;
            });

            promises.push(look.products().attach(products));
        }

        return Promise.all(promises);
    })
    .then(function () {
        return look.load(['tags', 'products', 'products.brand', 'characterType']);
    })
    .then(function (createdLook) {       
        res.render('admin/partials/look-row', { layout: false, moment: moment, look: createdLook.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function (req, res) {    
    Look.destroy({ id: req.params.id })
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;