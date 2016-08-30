'use strict';

let express = require('express'),
    router = express.Router(),
    VideoMedia = require('../models/video-media'),
    Product = require('../models/product'),
    Location = require('../models/location'),
    WorkersInVideoMedia = require('../models/workers-in-video-media'),
	Bookmark = require('../models/bookmark'),
    Like = require('../models/like'),
    bookshelf = require('../database/database'),
    moment = require('moment'),
    _ = require('lodash');

router.get('/:id*', function (req, res, next) {
    if (req.xhr) {
        Promise.resolve()
        .then(function () {
            var filter = req.query.filter;
                
            if (filter === 'Lieux') {
                return Location.getAllLocationsByMediaID(req.params.id, res.locals.user, req.query.filter).fetchAll();
            } else {
                return Product.getAllProductsByMediaID(req.params.id, res.locals.user, req.query.filter).fetchAll();
            }
        })       
        .then(function (allassets) {
            res.locals.allAssets = allassets.toJSON();
            res.render('partials/video-media-assets', { layout: false, videoMediaID: req.params.id });
        })       
        .catch(function (err) {
            return next(new Error(err));
        });
    } else {
        let timelines = {
            fashion: {
                domID: 'fashion',
                assetTypeCaption: 'Prêt-à-porter',
                assetTypeIcon: 'icon-shirt',
                assets: {}
            },

            objects: {
                domID: 'objects',
                assetTypeCaption: 'Objets',
                assetTypeIcon: 'icon-objects',
                assets: {}
            },

            locations: {
                domID: 'locations',
                assetTypeCaption: 'Lieux',
                assetTypeIcon: 'icon-map',
                assets: {}
            }
        }

        VideoMedia.findById(req.params.id, { withRelated: ['mediaGenre', 'sets', 'sets.products', 'sets.categories', 'looks', 'looks.products', 'looks.categories', 'looks.character', 'looks.character.type', 'products', 'products.brand', 'products.categories', 'locations', 'locations.categories'], require: true })
        .then(function (videoMedia) {
            moment.locale('fr');
            res.locals.moment = moment;
            res.locals.videoMedia = videoMedia.toJSON();
            dispatchAssets(timelines, res.locals.videoMedia.products);
            dispatchAssets(timelines, res.locals.videoMedia.looks);
            dispatchAssets(timelines, res.locals.videoMedia.sets);
            dispatchAssets(timelines, res.locals.videoMedia.locations);
            res.locals.timelines = timelines;

            return WorkersInVideoMedia.findAll({ video_media_id: videoMedia.id }, { withRelated: ['workerType', 'worker'] });
        })
        .then(function (workers) {
            res.locals.workingTeam = _.groupBy(workers.toJSON(), function (worker) {
                return worker.workerType.name;
            });

            if (req.isAuthenticated()) {
                return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'video media', bookmark_id: res.locals.videoMedia.id }).fetch()
                .then(function (bookmark) {
                    if (bookmark)
                        res.locals.bookmark = true;

                    return Like.forge({ user_id: req.user.id, target_type: 'video media', target_id: res.locals.videoMedia.id }).fetch()
                    .then(function (like) {
                        return like;
                    });
                });
            } else {
                return null;
            }
        })
        .then(function (like) {
            if (like)
                res.locals.like = true;

            return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['video media', res.locals.videoMedia.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));
        })
        .then(function (likeCount) {
            if (likeCount && likeCount.length > 0)
                res.locals.likeCount = likeCount[0].like_count;

            return Product.getAllProductsByMediaID(res.locals.videoMedia.id, res.locals.user)
            .fetchAll();
        })
        .then(function (allProducts) {
            res.locals.allAssets = allProducts.toJSON();           
            res.render('movies/movie');
        })
        .catch(function (err) {
            return next(new Error(err));
        });
    }
});

function dispatchAssets(timelines, assets) {
    assets.forEach(function (asset) {

        var categoryPaths = '';
        asset.categories.forEach(function (category) {
            categoryPaths += category.path.toLowerCase() + ' ';
        });

        if (categoryPaths.includes('mode') || categoryPaths.includes('look')) {
            var positions = asset.time_codes || asset._pivot_time_codes;

            positions.forEach(function (position) {
                timelines.fashion.assets[position] === undefined ? timelines.fashion.assets[position] = [asset] : timelines.fashion.assets[position].push(asset);
            });
        } else if (categoryPaths.includes('décoration') || categoryPaths.includes('transport') || categoryPaths.includes('décor')) {

            var positions = asset.time_codes || asset._pivot_time_codes;

            positions.forEach(function (position) {
                timelines.objects.assets[position] === undefined ? timelines.objects.assets[position] = [asset] : timelines.objects.assets[position].push(asset);
            });
        } else if (categoryPaths.includes('lieux')) {

            var positions = asset.time_codes || asset._pivot_time_codes;

            positions.forEach(function (position) {
                timelines.locations.assets[position] === undefined ? timelines.locations.assets[position] = [asset] : timelines.locations.assets[position].push(asset);
            });
        }
    });
}

module.exports = router