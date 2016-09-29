'use strict';

let bookshelf = require('../database/database'),
    helper = require('../helpers/helper');

require('./media-genre');
require('./worker');
require('./set');
require('./look');
require('./product');
require('./products-in-video-media');
require('./location');
require('./category');

var VideoMedia = bookshelf.Model.extend({
    tableName: 'video_medias',
    hasTimestamps: true,

    mediaGenre: function () {
        return this.belongsTo('MediaGenre');
    },

    //todo: to be removed ?
    workingTeam: function(){
        return this.belongsToMany('Worker');
    },

    sets: function () {
        return this.hasMany('Set');
    },

    looks: function () {
        return this.hasMany('Look');
    },

    products: function () {
        return this.belongsToMany('Product').withPivot(['time_codes', 'appearing_context', 'matching_status_id']);
    },

    locations: function () {
        return this.belongsToMany('Location').withPivot(['time_codes', 'appearing_context']);
    },

    categories: function () {
        return this.belongsToMany('Category');
    },

    virtuals: {
        type: function(){
            return 'video media';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }
});

module.exports = bookshelf.model('VideoMedia', VideoMedia);