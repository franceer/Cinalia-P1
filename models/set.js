'use strict';

let bookshelf = require('../database/database');

require('./video-media');
require('./product');

let Set = bookshelf.Model.extend({
    tableName: 'sets',
    hasTimestamps: true,

    videoMedia: function(){
        return this.belongsTo('VideoMedia');
    },

    products: function () {
        return this.belongsToMany('Product').through('ProductsInSet');
    },

    virtuals: {
        type: function () {
            return 'Set';
        },
        sectionUrl: function () {
            return 'sets';
        }
    }
});

module.exports = bookshelf.model('Set', Set);