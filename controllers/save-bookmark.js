var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport'),
	Bookmark = require('../models/bookmark');

router.post('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var obj = req.body;
        var bookmarkPromise = Bookmark.forge().where({ user_id: req.user.id, bookmark_type: obj.objectType, bookmark_id: obj.objectID });

        if (obj.action === 'save') {
            bookmarkPromise.fetch()
            .then(function (bookmark) {
                if (!bookmark) {
                    Bookmark.create({ user_id: req.user.id, bookmark_type: obj.objectType, bookmark_id: obj.objectID })
                    .then(function (bookmark) {
                        res.json({ status: 'saved', bookmarkID: bookmark.get('id') });
                    })
                    .catch(function (error) {
                        res.json({ status: 'error', message: error.message });
                    });
                } else {
                    res.json({ status: 'cancelled' });
                }
            });

        } else {
            bookmarkPromise.destroy().then(function (bookmark) {
                res.json({ status: 'destroyed' });
            })
            .catch(function (error) {
                res.json({ status: 'error', message: error.message });
            });
        }
    } else {
        res.json({ status: 'not logged in' });
    }
	
});

module.exports = router