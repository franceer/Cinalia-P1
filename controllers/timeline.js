var express = require('express'),
    router = express.Router(),
    timeline = require('../models/timeline');

router.get('/:id', function (req, res) {
    timeline.get(req.params.id, function (err, timeline) {
        var timelineArray = {};
        
        timeline.forEach(function (product) {
            var positions = product.TimeCodes;
            
            positions.forEach(function (position) {
                timelineArray[position] === undefined ? timelineArray[position] = [product] : timelineArray[position].push(product);
            });
        });

        res.render('timelines/timeline', { timeline: timelineArray });
    });
});

module.exports = router