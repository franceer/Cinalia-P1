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
            return 'set';
        },
        displayType: function () {
            return 'décor';
        },
        sectionUrl: function () {
            return 'sets';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }
},
{
    getLastSets: function (id, limit) {
        return this.query(function (qb) {
            qb.limit(limit ? limit : 4);
            qb.orderBy('created_at', 'desc');
            qb.where('id', '<>', id);
        }).fetchAll({withRelated: ['videoMedia']});
    }
});

module.exports = bookshelf.model('Set', Set);