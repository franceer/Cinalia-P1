'use strict';

let bookshelf = require('../database/database');

require('./worker');
require('./video-media');
require('./worker-type');

let WorkersInVideoMedia = bookshelf.Model.extend({
    tableName: 'video_medias_workers',
    hasTimestamps: false,

    worker: function () {
        return this.belongsTo('Worker');
    },

    videoMedia: function () {
        return this.belongsTo('VideoMedia');
    },

    workerType: function () {
        return this.belongsTo('WorkerType');
    }
});

module.exports = bookshelf.model('WorkersInVideoMedia', WorkersInVideoMedia);