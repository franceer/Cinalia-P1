var express = require('express'),
    router = express.Router(),
    passport = require('../auth/passport'),
	Like = require('../models/like');

router.post('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var obj = req.body;
        var likePromise = Like.forge().where({ user_id: req.user.id, target_type: obj.objectType, target_id: obj.objectID });

        if (obj.action === 'like') {
            likePromise.fetch()
            .then(function (like) {
                if (!like) {
                    Like.create({ user_id: req.user.id, target_type: obj.objectType, target_id: obj.objectID })
                    .then(function (like) {
                        res.json({ status: 'liked' });
                    })
                    .catch(function (error) {
                        res.json({ status: 'error', message: error.message });
                    });
                } else {
                    res.json({ status: 'already liked', message:  'Elément déjà aimé' });
                }
            });
        } else {
            likePromise.destroy().then(function (like) {
                res.json({ status: 'unliked' });
            })
            .catch(function (error) {
                res.json({ status: 'error', message: error.message });
            });
        }
    } else {
        res.json({ status: 'not logged in', message: 'Vous devez être connecté pour effectuer cette action' });
    }	
});

module.exports = router