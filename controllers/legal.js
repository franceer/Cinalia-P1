'use strict';

let express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {

    res.render('legal/legal');
});

module.exports = router