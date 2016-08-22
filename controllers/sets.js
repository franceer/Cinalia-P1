'use strict';

let express = require('express'),
    router = express.Router(),
    ProductsInSet = require('../models/products-in-set'),
    bookshelf = require('../database/database'),
    Bookmark = require('../models/bookmark'),
    Like = require('../models/like'),
    Set = require('../models/set');

router.get('/:id*', function (req, res, next) {
    Set.findById(req.params.id, { withRelated: ['videoMedia'] })
    .then(function (set) {
        res.locals.set = set.toJSON();
        return ProductsInSet.findAll({ set_id: req.params.id }, { withRelated: ['product', 'product.brand', 'matchingStatus'] });
    })
    .then(function (productsInSet) {
        res.locals.products = productsInSet.toJSON();

        if (req.isAuthenticated()) {
            return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'set', bookmark_id: res.locals.set.id }).fetch()
            .then(function (bookmark) {
                if (bookmark)
                    res.locals.bookmark = true;

                return Like.forge({ user_id: req.user.id, target_type: 'set', target_id: res.locals.set.id }).fetch()
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

        return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['set', res.locals.set.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));
    })
    .then(function (likeCount) {
        if (likeCount && likeCount.length > 0)
            res.locals.likeCount = likeCount[0].like_count;

        res.render('sets/sets');
    })
    .catch(function (err) {
        return next(new Error(err));
    });
});

module.exports = router