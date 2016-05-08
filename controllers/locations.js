var express = require('express'),
    router = express.Router();

router.get('/:id', function (req, res) {
    res.render('locations/locations');
});

module.exports = router