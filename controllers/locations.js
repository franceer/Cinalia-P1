'use strict';

let express = require('express'),
    router = express.Router(),
    Location = require('../models/location'),
    Bookmark = require('../models/bookmark'),
    bookshelf = require('../database/database'),
    Like = require('../models/like'),
    _ = require('lodash');

router.get('/:id*', function (req, res, next) {
    Location.findById(req.params.id, { withRelated: ['videoMedias'] })
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

        res.locals.location = locationTemp;

        if (req.isAuthenticated()) {
            return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'location', bookmark_id: res.locals.location.id }).fetch()
            .then(function (bookmark) {
                if(bookmark)
                    res.locals.bookmark = true;

                return Like.forge({ user_id: req.user.id, target_type: 'location', target_id: res.locals.location.id }).fetch()
                .then(function(like){
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

        return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['location', res.locals.location.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));            
    })
    .then(function (likeCount) {
        if (likeCount && likeCount.length > 0)
            res.locals.likeCount = likeCount[0].like_count;

        return Location.getLastLocations(res.locals.location.id, res.locals.user);
    })
    .then(function (lastLocations) {
        res.locals.lastLocations = lastLocations.toJSON();
        res.render('locations/locations');
    })
    .catch(function (err) {
        return next(new Error(err));
    });
});

module.exports = router