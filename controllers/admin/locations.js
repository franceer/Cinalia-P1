var express = require('express'),
    router = express.Router(),
    helper = require('../../helpers/helper'),
    Promise = require('bluebird'),
    Location = require('../../models/location'),
    moment = require('moment'),
    fs = require('fs'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let currentPage = req.query.p ? req.query.p : 1;

    Location.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 30, page: parseInt(currentPage), withRelated: ['tags'] })
    .then(function (locations) {          
        locations.pagination.data = helper.getPaginationData(locations.pagination.rowCount, locations.pagination.pageSize, 10, locations.pagination.page);
        res.render('admin/locations', { locations: locations.toJSON(), pagination: locations.pagination, moment: moment });
    });    
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;        
    });

    //var tagsIDs = req.body.tags;
    //delete req.body.tags;
    var tagsIDs = req.body.tags;
    delete req.body.tags;
    var location;

    Location.findOne({ id: req.params.id }, { require: false }).then(function (oldLocation) {
        if (oldLocation.get('picture_url') !== req.body.picture_url) {
            var index1 = oldLocation.get('picture_url').indexOf(process.env.NODE_ENV);
            var index2 = oldLocation.get('picture_url').lastIndexOf('/');

            return helper.deleteS3Objects(oldLocation.get('picture_url').substring(index1, index2))
            .then(function (deleted) {
                return helper.uploadImagesToS3(req, 'picture_url', ['name', 'city_state_country'], 'locations');
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

        return Location.update(req.body, { id: req.params.id });
    })
    .then(function (updatedLocation) {
        location = updatedLocation;
        var returned = null;

        if (tagsIDs) {
            returned = location.tags().detach().then(function () {
                return location.tags().attach(tagsIDs);
            });
        }

        return returned;
    })
    .then(function () {
        return location.load(['tags']);
    })
    .then(function (updatedLocation) {        
        res.render('admin/partials/location-row', { layout: false, moment: moment, location: updatedLocation.toJSON() });
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
    delete req.body.tags;
    var location;
       
    helper.uploadImagesToS3(req, 'picture_url', ['name', 'city_state_country'], 'locations')
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

        return Location.create(req.body);
    })
    .then(function (addedLocation) {
        location = addedLocation;
        var returned = null;

        if (tagsIDs)
            returned = location.tags().attach(tagsIDs);

        return returned;       
    })
    .then(function () {
        return location.load(['tags']);
    })
    .then(function (addedLocation) {
        res.render('admin/partials/location-row', { layout: false, moment: moment, location: addedLocation.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });    
})
.delete('/:id', function (req, res) {
    Location.findOne({ id: req.params.id })
    .then(function (location) {
        var index1 = location.get('picture_url').indexOf(process.env.NODE_ENV);
        var index2 = location.get('picture_url').lastIndexOf('/');

        return helper.deleteS3Objects(location.get('picture_url').substring(index1, index2))
        .catch(function (err) { /*Do nothing in case the images doesn't exist anymore*/ })
        .then(function () {
            return Location.destroy({ id: req.params.id });
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