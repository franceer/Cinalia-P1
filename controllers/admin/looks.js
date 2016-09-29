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

    Look.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: ['categories'] })
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

    var categoriesIDs = req.body.categories;
    delete req.body.categories;
    var look;
    
    look.update(req.body, { id: req.params.id })
    .then(function (updatedlook) {
        look = updatedlook;
        var returned = null;

        if (categoriesIDs) {
            returned = look.categories().detach().then(function () {
                return look.categories().attach(categoriesIDs);
            });
        }

        return returned;
    })
    .then(function () {
        return look.load(['categories']);
    })
    .then(function (updatedlook) {
        res.render('admin/partials/look-row', { layout: false, moment: moment, look: updatedlook.toJSON() });
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

    var categoriesIDs = req.body.categories;
    delete req.body.categories;
    var look;

    look.create(req.body)
    .then(function (addedlook) {
        look = addedlook;
        var returned = null;

        if (categoriesIDs)
            returned = look.categories().attach(categoriesIDs);

        return returned;       
    })
    .then(function () {
        return look.load(['categories']);
    })
    .then(function (createdLook) {       
        res.render('admin/partials/look-row', { layout: false, moment: moment, look: createdLook.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function (req, res) {    
    look.destroy({ id: req.params.id })
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;