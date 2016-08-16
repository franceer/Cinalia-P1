'use strict';

let bookshelf = require('../database/database');

require('./brand');
require('./product-type');
require('./product-category');
require('./video-media');
require('./products-in-video-media');
require('./set');
require('./look');

let Product = bookshelf.Model.extend({
    tableName: 'products',
    hasTimestamps: true,

    type: function () {
        return this.belongsTo('ProductType');
    },

    brand: function () {
        return this.belongsTo('Brand');
    },

    categories : function(){
        return this.belongsToMany('ProductCategory');
    },

    matchingStatuses: function () {
        return this.belongsToMany('MatchingStatus').through('ProductsInVideoMedia');
    },

    videoMedias : function(){
        return this.belongsToMany('VideoMedia').through('ProductsInVideoMedia').withPivot(['time_codes', 'appearing_context']);
    },
	
    sets: function () {
        return this.belongsToMany('Set').through('ProductsInSet');
    },

    looks: function () {
        return this.belongsToMany('Look').through('ProductsInLook');
    },
	
	similarProducts: function(){
		return this.hasMany('Product', 'parent_product_id');
	},

    virtuals: {       
        section_url: function () {
            return 'products';
        }
    }
});

module.exports = bookshelf.model('Product', Product);