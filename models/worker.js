'use strict';

let bookshelf = require('../database/database');

require('./video-media');

var Worker = bookshelf.Model.extend({
    tableName: 'workers',
    hasTimestamps: true,

    videoMedias: function () {
        return this.belongsToMany('VideoMedia');
    }    
});

module.exports = bookshelf.model('Worker', Worker);