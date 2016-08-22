'use strict';

const url = require('url');

module.exports = function (req, res, next) {
    var urlObj = url.parse(req.originalUrl);
    urlObj.protocol = req.protocol;
    urlObj.host = req.get('host');
    res.locals.pageURL = url.format(urlObj);    
	next();
}