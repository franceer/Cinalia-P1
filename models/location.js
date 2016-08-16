'use strict';

let bookshelf = require('../database/database');

require('./video-media');

let Location = bookshelf.Model.extend({
    tableName: 'locations',
    hasTimestamps: true,

    videoMedias : function(){
        return this.belongsToMany('VideoMedia').withPivot(['time_codes', 'appearing_context']);
    },

    virtuals: {
        type: function () {
            return 'Location';
        },
        sectionUrl: function () {
            return 'locations';
        }
    }
});

module.exports = bookshelf.model('Location', Location);