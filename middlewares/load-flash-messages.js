'use strict'

let helper = require('../helpers/helper');

module.exports = function (req, res, next) {
    res.locals.flashMessage = helper.setupFlashMessages(req.flash());	
	next();
}