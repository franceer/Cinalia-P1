var express = require('express'),
    router = express.Router(),
    helper = require('../../helpers/helper'),
    Promise = require('bluebird'),
    Set = require('../../models/set'),
    Product = require('../../models/product'),
    moment = require('moment'),
    fs = require('fs'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let currentPage = req.query.p ? req.query.p : 1;

    Set.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: [/*'categories'*/'tags', 'products', 'products.brand'] })
    .then(function (sets) {          
        sets.pagination.data = helper.getPaginationData(sets.pagination.rowCount, sets.pagination.pageSize, 10, sets.pagination.page);
        res.render('admin/sets', { sets: sets.toJSON(), pagination: sets.pagination, moment: moment });
    });    
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'media_character_id')
            req.body[key] = req.body[key][0];
    });

    //var categoriesIDs = req.body.categories;
    //var products = req.body.products;
    //delete req.body.categories;
    var tagsIDs = req.body.tags;
    var products = req.body.products;
    delete req.body.tags;
    delete req.body.products;
    var set;

    Set.findOne({ id: req.params.id }, { require: false }).then(function (oldSet) {
        if (oldSet.get('picture_url') !== req.body.picture_url) {
            var index1 = oldSet.get('picture_url').indexOf(process.env.NODE_ENV);
            var index2 = oldSet.get('picture_url').lastIndexOf('/');

            return helper.deleteS3Objects(oldSet.get('picture_url').substring(index1, index2))
            .then(function (deleted) {
                return helper.uploadImagesToS3(req, 'picture_url', ['name'], 'sets');
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
            req.body.picture_alt = req.body.name;

        if (!req.body.picture_title || req.body.picture_title.length === 0)
            req.body.picture_title = req.body.picture_alt;
    
        return Set.update(req.body, { id: req.params.id });
    })
    .then(function (updatedSet) {
        set = updatedSet;
        var promises = [];
        
        //promises.push(set.categories().detach().then(function () {
        //    if (categoriesIDs)
        //        return set.categories().attach(categoriesIDs);            
        //}));
        promises.push(set.tags().detach().then(function () {
            if (tagsIDs)
                return set.tags().attach(tagsIDs);
        }));

        promises.push(set.products().detach().then(function () {
            if (products) {
                products.forEach(function (product) {
                    if (product.appearing_context === '')
                        product.appearing_context = null;                    
                });

                return set.products().attach(products);
            }                
        }));        

        return Promise.all(promises);
    })
    .then(function () {
        return set.load([/*'categories'*/'tags', 'products', 'products.brand']);
    })
    .then(function (updatedSet) {
        res.render('admin/partials/set-row', { layout: false, moment: moment, set: updatedSet.toJSON() });
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'media_character_id')
            req.body[key] = req.body[key][0];
    });

    //var categoriesIDs = req.body.categories;
    //var products = req.body.products;
    //delete req.body.categories;
    var tagsIDs = req.body.tags;
    var products = req.body.products;
    delete req.body.tags;
    delete req.body.products;
    var set;

    helper.uploadImagesToS3(req, 'picture_url', ['name'], 'sets')
    .then(function(files){
        var originalURL;

        files.forEach(function(file){
            if(file.data.Location.indexOf('original') !== -1)
                originalURL = file.data.Location;
        });

        req.body.picture_url = originalURL;

        if (!req.body.picture_alt || req.body.picture_alt.length === 0)
            req.body.picture_alt = req.body.name;

        if (!req.body.picture_title || req.body.picture_title.length === 0)
            req.body.picture_title = req.body.picture_alt;

        return Set.create(req.body);
    })    
    .then(function (addedSet) {
        set = addedSet;
        var promises = [];

        //if (categoriesIDs) {
        //    promises.push(set.categories().attach(categoriesIDs));
        //}
        if (tagsIDs) {
            promises.push(set.tags().attach(tagsIDs));
        }

        if (products) {
            products.forEach(function (product) {
                if (product.appearing_context === '')
                    product.appearing_context = null;
            });

            promises.push(set.products().attach(products));
        }

        return Promise.all(promises);
    })
    .then(function () {
        return set.load([/*'categories'*/'tags', 'products', 'products.brand']);
    })
    .then(function (createdSet) {       
        res.render('admin/partials/set-row', { layout: false, moment: moment, set: createdSet.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function (req, res) {    
    Set.destroy({ id: req.params.id })
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;