var express = require('express'),
    router = express.Router(),
    VideoMedia = require('../../models/video-media'),
    //MediaGenre = require('../../models/media-genre'),
    Looks = require('../../collections/looks'),
    Look = require('../../models/look'),
    Sets = require('../../collections/sets'),
    Set = require('../../models/set'),
    Promise = require('bluebird'),
    helper = require('../../helpers/helper'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    moment = require('moment');

router.get('/', function (req, res) {
    //Promise.all([MediaGenre.fetchAll(),VideoMedia.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 50, page: 1, withRelated: ['mediaGenre', 'tags', 'products', 'products.brand', 'locations', 'looks', 'sets'] })])
    VideoMedia.query(function (qb) { qb.orderByRaw('updated_at DESC NULLS LAST, created_at DESC, id DESC'); }).fetchPage({ pageSize: 50, page: 1, withRelated: [/*'mediaGenre',*/ 'tags', 'products', 'products.brand', 'locations', 'looks', 'sets'] })
    .then(function (results) {
        //var genres = results[0];
        //var videoMedias = results[1];
        var videoMedias = results;
        res.render('admin/movies', {/*genres: genres.toJSON(), */videoMedias: videoMedias.toJSON(), moment: moment });
    });    
})
.put('/:id', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'theater_release_date' || key === 'tv_release_date') {
            var parsedDate = moment(req.body[key], 'DD/MM/YYYY');
            req.body[key] = process.env.NODE_ENV === 'production' ? parsedDate.format('MMM-DD-YYYY') : parsedDate.format('DD-MMM-YYYY');
        }
    });

    var tagsIDs = req.body.tags;
    var products = req.body.products;
    var locations = req.body.locations;
    var looks = req.body.looks;
    var sets = req.body.sets;
    delete req.body.tags;
    delete req.body.products;
    delete req.body.locations;
    delete req.body.looks;
    delete req.body.sets;
    var videoMedia;

    //MediaGenre.findOne({ name: req.body.media_genre_name }, { require: false })
    //.then(function (genre) {
    //    var returned = null;

    //    if (!genre)
    //        returned = MediaGenre.create({ name: req.body.media_genre_name });

    //    return returned;
    //})
    //.then(function (genre) {
    //    if (genre)
    //        req.body.media_genre_id = genre.get('id');

    //    return VideoMedia.findOne({ id: req.params.id }, { require: false });
    //})    
    VideoMedia.findOne({ id: req.params.id }, { require: false })
    .then(function (oldVideoMedia) {
        if (oldVideoMedia.get('poster_url') !== req.body.poster_url) {
            var index1 = oldVideoMedia.get('poster_url').indexOf(process.env.NODE_ENV);
            var index2 = oldVideoMedia.get('poster_url').lastIndexOf('/');

            return helper.deleteS3Objects(oldVideoMedia.get('poster_url').substring(index1, index2))            
            .catch(function (err) {/*Do nothing in case the images doesn't exist anymore*/ })
            .then(function () {
                return helper.uploadImagesToS3(req, 'poster_url', ['name'], 'medias');
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

            req.body.poster_url = originalURL;
        }

        if (!req.body.poster_alt || req.body.poster_alt.length === 0)
            req.body.poster_alt = /*req.body.media_genre_name + ' ' + */req.body.name;

        if (!req.body.poster_title || req.body.poster_title.length === 0)
            req.body.poster_title = req.body.poster_alt;

        //delete req.body.media_genre_name;
        return VideoMedia.update(req.body, { id: req.params.id });
    })
    .then(function (updatedVideoMedia) {
        videoMedia = updatedVideoMedia;
        var promises = [];

        promises.push(videoMedia.tags().detach().then(function () {
            if (tagsIDs)
                return videoMedia.tags().attach(tagsIDs);
        }));

        promises.push(videoMedia.products().detach().then(function () {
            if (products) {
                products.forEach(function (product) {
                    if (product.appearing_context === '')
                        product.appearing_context = null;
                });

                return videoMedia.products().attach(products);
            }
        }));

        promises.push(videoMedia.locations().detach().then(function () {
            if (locations) {
                locations.forEach(function (location) {
                    if (location.appearing_context === '')
                        location.appearing_context = null;
                });

                return videoMedia.locations().attach(locations);
            }
        }));

        promises.push(Look.where({ video_media_id: videoMedia.id }).fetchAll()
        .then(function (oldLooks) {
            if (oldLooks.length > 0) {
                oldLooks.forEach(function (look) {
                    look.set('video_media_id', null);
                });

                return oldLooks.invokeThen('save');
            } else
                return null;
        })
        .then(function () {
            if (looks) {
                looks.forEach(function (look) {
                    look.video_media_id = videoMedia.id;
                });

                return Looks.forge(looks).invokeThen('save');
            }
        }));

        promises.push(Set.where({ video_media_id: videoMedia.id }).fetchAll()
        .then(function (oldSets) {
            if (oldSets.length > 0) {
                oldSets.forEach(function (iset) {
                    iset.set('video_media_id', null);
                });

                return oldSets.invokeThen('save');
            } else
                return null;
        })
        .then(function () {
            if (sets) {
                sets.forEach(function (set) {
                    set.video_media_id = videoMedia.id;
                });

                return Sets.forge(sets).invokeThen('save');
            }
        }));

        //looks.forEach(function (look) {
        //    look.video_media_id = videoMedia.id;
        //});
        //sets.forEach(function (set) {
        //    set.video_media_id = videoMedia.id;
        //});

        //promises.push(Looks.forge(looks).invokeThen('save'));
        //promises.push(Sets.forge(sets).invokeThen('save'));

        return promises.length > 0 ? Promise.all(promises) : null;
    })
    .then(function () {
        //return Promise.all([MediaGenre.fetchAll(), videoMedia.load(['mediaGenre', 'tags', 'products', 'products.brand', 'locations', 'looks', 'sets'])]);
        return videoMedia.load(['tags', 'products', 'products.brand', 'locations', 'looks', 'sets']);
    })
    .then(function (results) {
        //var genres = results[0];
        //var updatedVideoMedia = results[1];
        var updatedVideoMedia = results;
        res.render('admin/partials/video-media-row', { layout: false, moment: moment, /*genres: genres.toJSON(),*/ videoMedia: updatedVideoMedia.toJSON() });
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
        else if (key === 'theater_release_date' || key === 'tv_release_date') {
            var parsedDate = moment(req.body[key], 'DD/MM/YYYY');
            req.body[key] = process.env.NODE_ENV === 'production' ? parsedDate.format('MMM-DD-YYYY') : parsedDate.format('DD-MMM-YYYY');
        }
    });

    var tagsIDs = req.body.tags;
    var products = req.body.products;
    var locations = req.body.locations;
    var looks = req.body.looks;
    var sets = req.body.sets;
    delete req.body.tags;
    delete req.body.products;
    delete req.body.locations;
    delete req.body.looks;
    delete req.body.sets;
    var videoMedia;

    //MediaGenre.findOne({ name: req.body.media_genre_name }, { require: false })
    //.then(function (genre) {
    //    var returned = null;

    //    if (!genre)
    //        returned = MediaGenre.create({ name: req.body.media_genre_name });

    //    return returned;
    //})
    //.then(function (genre) {
    //    if (genre)
    //        req.body.media_genre_id = genre.get('id');

    //    return helper.uploadImagesToS3(req, 'poster_url', ['name'], 'media');
    //})
    helper.uploadImagesToS3(req, 'poster_url', ['name'], 'medias')
    .then(function (files) {
        var originalURL;

        files.forEach(function (file) {
            if (file.data.Location.indexOf('original') !== -1)
                originalURL = file.data.Location;
        });

        req.body.poster_url = originalURL;

        if (!req.body.poster_alt || req.body.poster_alt.length === 0)
            req.body.poster_alt = /*req.body.media_genre_name + ' ' + */req.body.name;

        if (!req.body.poster_title || req.body.poster_title.length === 0)
            req.body.poster_title = req.body.poster_alt;

        //delete req.body.media_genre_name;
        return VideoMedia.create(req.body);
    })
    .then(function (videoMediaTemp) {
        videoMedia = videoMediaTemp;
        var promises = [];

        if (tagsIDs)
            promises.push(videoMedia.tags().attach(tagsIDs));

        if (products) {
            products.forEach(function (product) {
                if (product.appearing_context === '')
                    product.appearing_context = null;                    
            });

            promises.push(videoMedia.products().attach(products));
        }
       
        if (locations) {
            locations.forEach(function (location) {
                if (location.appearing_context === '')
                    location.appearing_context = null;                    
            });

            promises.push(videoMedia.locations().attach(locations));
        }
    
        if(looks){
            looks.forEach(function (look) {
                look.video_media_id = videoMedia.id;
            });            

            promises.push(Looks.forge(looks).invokeThen('save'));
        }

        if (sets) {
            sets.forEach(function (set) {
                set.video_media_id = videoMedia.id;
            });

            promises.push(Sets.forge(sets).invokeThen('save'));
        }

        return Promise.all(promises);
    })
    .then(function () {
        //return Promise.all([MediaGenre.fetchAll(), videoMedia.load(['mediaGenre', 'tags', 'products', 'products.brand', 'locations', 'looks', 'sets'])]);
        return videoMedia.load(['tags', 'products', 'products.brand', 'locations', 'looks', 'sets']);
    })
    .then(function (results) {
        //var genres = results[0];
        //var videoMedia = results[1];
        var videoMedia = results;
        res.render('admin/partials/video-media-row', { layout: false, moment: moment, /*genres: genres.toJSON(),*/ videoMedia: videoMedia.toJSON() });
    })    
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
})
.delete('/:id', function (req, res) {
    VideoMedia.findOne({ id: req.params.id })
    .then(function (videoMedia) {
        var index1 = videoMedia.get('poster_url').indexOf(process.env.NODE_ENV);
        var index2 = videoMedia.get('poster_url').lastIndexOf('/');

        return helper.deleteS3Objects(videoMedia.get('poster_url').substring(index1, index2))
        .catch(function (err) { /*Do nothing in case the images doesn't exist anymore*/ })
        .then(function () {
            return VideoMedia.destroy({ id: req.params.id });
        });
    })   
    .then(function () {
        res.json({ status: 'success' });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

function nullifyProperties(object) {
    Object.keys(object).forEach(function (key) {
        if (object[key] === '')
            object[key] = null;
        else if (Array.isArray(object[key])) {
            if (object[key].length === 0)
                object[key] = null;
            else if (object[key].length === 1)
                object[key] = object[key][0] === '' ? null : (key !== 'time_codes' ? object[key][0] : object[key]);
            else {
                object[key].forEach(function (objInArray) {
                    nullifyProperties(objInArray);
                });               
            }
        }
    });
}

module.exports = router;