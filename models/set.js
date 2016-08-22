'use strict';

let bookshelf = require('../database/database'),
    helper = require('../helpers/helper');

require('./video-media');
require('./product');
require('./category');

let Set = bookshelf.Model.extend({
    tableName: 'sets',
    hasTimestamps: true,

    videoMedia: function(){
        return this.belongsTo('VideoMedia');
    },

    products: function () {
        return this.belongsToMany('Product').through('ProductsInSet');
    },

    categories: function () {
        return this.belongsToMany('Category');
    },

    virtuals: {
        type: function () {
            return 'décor';
        },
        sectionUrl: function () {
            return 'sets';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }
});

module.exports = bookshelf.model('Set', Set);