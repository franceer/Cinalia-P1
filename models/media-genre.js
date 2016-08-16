'use strict';

let bookshelf = require('../database/database');

require('./video-media');

var MediaGenre = bookshelf.Model.extend({
    tableName: 'media_genres',
    hasTimestamps: false,

    videoMedias: function () {
        return this.hasMany('VideoMedia');
    }    
});

module.exports = bookshelf.model('MediaGenre', MediaGenre);