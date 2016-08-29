'use strict';

let express = require('express'),
    router = express.Router(),
    ProductsInLook = require('../models/products-in-look'),
    bookshelf = require('../database/database'),
    Bookmark = require('../models/bookmark'),
    Like = require('../models/like'),
    Look = require ('../models/look'),
    _ = require('lodash');

router.get('/:id*', function (req, res, next) {
    Look.findById(req.params.id, { withRelated: ['videoMedia', 'character', 'character.type'] })
    .then(function (look) {
        res.locals.look = look.toJSON();
        return ProductsInLook.findAll({ look_id: req.params.id }, { withRelated: ['product', 'product.brand', 'bodyLocation', 'matchingStatus'] });
    })
    .then(function (productsInLook) {
        res.locals.products = _.groupBy(productsInLook.toJSON(), function (productInLook) {
            return productInLook.bodyLocation.name;
        });
        
        if (req.isAuthenticated()) {
            return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'look', bookmark_id: res.locals.look.id }).fetch()
            .then(function (bookmark) {
                if (bookmark)
                    res.locals.bookmark = true;

                return Like.forge({ user_id: req.user.id, target_type: 'look', target_id: res.locals.look.id }).fetch()
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

        return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['look', res.locals.look.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));
    })
    .then(function (likeCount) {
        if (likeCount && likeCount.length > 0)
            res.locals.likeCount = likeCount[0].like_count;

        return Look.getLastLooks(res.locals.look.id, res.locals.user);
    })
    .then(function (lastLooks) {
        res.locals.lastLooks = lastLooks.toJSON();
        res.render('looks/looks');
    })
    .catch(function (err) {
        return next(new Error(err));
    });
});

module.exports = router