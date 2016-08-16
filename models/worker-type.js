'use strict';

let bookshelf = require('../database/database');

require('./workers-in-video-media');

var WorkerType = bookshelf.Model.extend({
    tableName: 'worker_types',
    hasTimestamps: false,

    workersInVideoMedia: function () {
        return this.hasMany('WorkersInVideoMedia');
    },
});

module.exports = bookshelf.model('WorkerType', WorkerType);