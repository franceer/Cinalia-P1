'use strict';

let bookshelf = require('../database/database'),
    helper = require('../helpers/helper');

require('./video-media');
require('./category');

let Location = bookshelf.Model.extend({
    tableName: 'locations',
    hasTimestamps: true,

    videoMedias : function(){
        return this.belongsToMany('VideoMedia').withPivot(['time_codes', 'appearing_context']);
    },

    categories: function () {
        return this.belongsToMany('Category');
    },

    virtuals: {
        type: function () {
            return 'lieu';
        },
        sectionUrl: function () {
            return 'locations';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }
});

module.exports = bookshelf.model('Location', Location);