'use strict';

let express = require('express'),
    router = express.Router(),
    VideoMedia = require('../models/video-media'),
    WorkersInVideoMedia = require('../models/workers-in-video-media'),
	Bookmark = require('../models/bookmark'),
    bookshelf = require('../database/database'),
    moment = require('moment'),
    _ = require('lodash');

router.get('/:id', function (req, res, next) {
    let timelines = {
        fashion: {
            domID : 'fashion',
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

    VideoMedia.findById(req.params.id, { withRelated: ['mediaGenre', 'sets', 'sets.products', 'looks', 'looks.products', 'looks.character', 'looks.character.type', 'products', 'products.type', 'products.brand', 'locations'], require: true })
    .then(function (videoMedia) {
        moment.locale('fr');
        res.locals.moment = moment;
        res.locals.videoMedia = videoMedia.toJSON();
        dispatchAssets(timelines, res.locals.videoMedia.products);
        dispatchAssets(timelines, res.locals.videoMedia.looks);
        dispatchAssets(timelines, res.locals.videoMedia.sets);
        dispatchAssets(timelines, res.locals.videoMedia.locations);

        return WorkersInVideoMedia.findAll({ video_media_id: videoMedia.id }, { withRelated: ['workerType', 'worker'] });
    })
    .then(function (workers) {
        res.locals.workingTeam =  _.groupBy(workers.toJSON(), function (worker) {
            return worker.workerType.name;
        });
		
		if(req.isAuthenticated()){
			Bookmark.forge({user_id: req.user.id, bookmark_type: 'video media', bookmark_id: res.locals.videoMedia.id}).fetch({require: true})
			.then(function(bookmark){
				res.render('movies/movie', { timelines: timelines, bookmark: bookmark.toJSON() });
			})
			.catch(bookshelf.NotFoundError, function(err){
				res.render('movies/movie', { timelines: timelines });
			})
			.catch(function(err){
				return next(new Error(err));
			});
		}else{
			res.render('movies/movie', { timelines: timelines });
		}
    })
    .catch(bookshelf.NotFoundError, function (err) {
        res.status(404).send("Not Found");
    })
    .catch(function (err) {
        return next(new Error(err));
    });
});

function dispatchAssets(timelines, assets) {
    assets.forEach(function (asset) {
        let type = asset.type.name || asset.type;

        switch (type) {
            case 'Mode':
            case 'Look':
                var positions = asset.time_codes || asset._pivot_time_codes;

                positions.forEach(function (position) {
                    timelines.fashion.assets[position] === undefined ? timelines.fashion.assets[position] = [asset] : timelines.fashion.assets[position].push(asset);
                });
                break;
            case 'Décoration':
            case 'Transport':
            case 'Set':
                var positions = asset.time_codes || asset._pivot_time_codes;

                positions.forEach(function (position) {
                    timelines.objects.assets[position] === undefined ? timelines.objects.assets[position] = [asset] : timelines.objects.assets[position].push(asset);
                });
                break;
            case 'Location':
                var positions = asset.time_codes || asset._pivot_time_codes;

                positions.forEach(function (position) {
                    timelines.locations.assets[position] === undefined ? timelines.locations.assets[position] = [asset] : timelines.locations.assets[position].push(asset);
                });
                break;              
        }
    });
}

module.exports = router