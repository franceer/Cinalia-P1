'use strict';

let bookshelf = require('../database/database');

require('./products-in-video-media');
require('./products-in-look');
require('./products-in-set');

let MatchingStatus = bookshelf.Model.extend({
    tableName: 'matching_statuses',
    hasTimestamps: false,

    productsInVideoMedia: function () {
        return this.hasMany('ProductsInVideoMedia');
    },

    productsInLook: function () {
        return this.hasMany('ProductsInLook');
    },

    productsInSet: function () {
        return this.hasMany('ProductsInSet');
    },
});

module.exports = bookshelf.model('MatchingStatus', MatchingStatus);