'use strict';

let bookshelf = require('../database/database');

require('./video-media');

var SocialData = bookshelf.Model.extend({
    tableName: 'social_data',
    hasTimestamps: false,

    videoMedias: function () {
        return this.hasMany('VideoMedia');
    }
});

module.exports = bookshelf.model('SocialData', SocialData);