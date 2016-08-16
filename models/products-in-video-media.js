'use strict';

let bookshelf = require('../database/database');

require('./product');
require('./video-media');
require('./matching-status');

let ProductsInVideoMedia = bookshelf.Model.extend({
    tableName: 'products_video_medias',
    hasTimestamps: false,

    product: function () {
        return this.belongsTo('Product');
    },

    videoMedia: function () {
        return this.belongsTo('VideoMedia');
    },

    matchingStatus: function () {
        return this.belongsTo('MatchingStatus', 'matching_status_id');
    }
});

module.exports = bookshelf.model('ProductsInVideoMedia', ProductsInVideoMedia);