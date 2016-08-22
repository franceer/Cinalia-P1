'use strict';

let express = require('express'),
    gravatar = require('gravatar'),
    bookshelf = require('../database/database'),
    Like = require('../models/like'),
    Bookmark = require('../models/bookmark'),
    User = require('../models/user'),
    router = express.Router();

router.get('/', function (req, res, next) {
	if(!req.isAuthenticated())
	    res.redirect('/');

	res.locals.gravatarURL = gravatar.url(res.locals.user.email, { r: 'pg', d: 'mm', s: '150' }, false);
	
    Bookmark.getAllBookmarksForUser(res.locals.user.id)
    .then(function (bookmarks) {
        res.locals.bookmarks = bookmarks;

        return Like.getAllLikesForUser(res.locals.user.id);
    })
    .then(function (likes) {
        res.locals.likes = likes;
        res.render('profile/profile');
    })
    .catch(function (err) {
        return next(new Error(err));
    });
})
.post('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        let attributes = req.body;
        attributes.id = res.locals.user.id;
        User.forge(attributes)
        .save()
        .then(function (user) {
            res.json({status: 'saved'});
        })
        .catch(function (err) {
            res.json({ status: 'error', message: err.message });
        });
    }
    else {
        res.json({ status: 'not logged in' })
    }
});

module.exports = router