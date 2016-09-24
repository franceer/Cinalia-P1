'use strict';

let bookshelf = require('../database/database'),
    helper = require('../helpers/helper');

require('./brand');
require('./product-type');
require('./category');
require('./video-media');
require('./products-in-video-media');
require('./set');
require('./look');

let Product = bookshelf.Model.extend({
    tableName: 'products',
    hasTimestamps: true,  

    brand: function () {
        return this.belongsTo('Brand');
    },

    categories : function(){
        return this.belongsToMany('Category');
    },

    matchingStatuses: function () {
        return this.belongsToMany('MatchingStatus');
    },

    videoMedias : function(){
        return this.belongsToMany('VideoMedia').through('ProductsInVideoMedia').withPivot(['time_codes', 'appearing_context']);
    },
	
    sets: function () {
        return this.belongsToMany('Set');
    },

    looks: function () {
        return this.belongsToMany('Look');
    },

    parentProduct: function () {
        return this.belongsTo('Product', 'parent_product_id');
    },
	
	similarProducts: function(){
		return this.hasMany('Product', 'parent_product_id');
	},

	virtuals: {
	    type: function () {
	        return 'product';
	    },
	    displayType: function () {
	        return 'produit';
	    },
        sectionUrl: function () {
            return 'products';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.related('brand').get('name') + ' ' + this.get('name'));
        }
    }
},
{
    getAllProductsByMediaID: function (id, user, filter) {
        return this.query(function (qb) {
            if (user) {
                qb.joinRaw('LEFT JOIN user_bookmarks b1 ON b1.bookmark_id = products.id AND b1.user_id = ' + user.id + ' AND b1.bookmark_type = \'product\'');
            }

            if (filter) {
                qb.join('categories_products as cp', 'cp.product_id', '=', 'products.id');
                qb.join('categories as c', 'cp.category_id', '=', 'c.id');
                qb.where('c.path', '~', '*.' + filter + '.*');
            }

            qb.join('brands as b', 'b.id', '=', 'products.brand_id');
            qb.join('looks_products as lp', 'products.id', '=', 'lp.product_id');
            qb.join('looks as l', 'lp.look_id', '=', 'l.id');
            qb.join('video_medias as vm', 'l.video_media_id', '=', 'vm.id');
            qb.where('vm.id', '=', id);            
            qb.select(bookshelf.knex.raw('products.id, b.name as brand_name, products.name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url' + (user ? ', b1.id as bookmark_id' : '')));
            qb.union(function () {
                if (user) {
                    this.joinRaw('LEFT JOIN user_bookmarks b2 ON b2.bookmark_id = products.id AND b2.user_id = ' + user.id + ' AND b2.bookmark_type = \'product\'');
                }

                if (filter) {
                    this.join('categories_products as cp1', 'cp1.product_id', '=', 'products.id');
                    this.join('categories as c1', 'cp1.category_id', '=', 'c1.id');
                    this.where('c1.path', '~', '*.' + filter + '.*');
                }

                this.join('brands as b', 'b.id', '=', 'products.brand_id');
                this.join('products_sets as ps', 'products.id', '=', 'ps.product_id');
                this.join('sets as s', 'ps.set_id', '=', 's.id');
                this.join('video_medias as vm', 's.video_media_id', '=', 'vm.id');
                this.where('vm.id', '=', id);
                this.from('products');
                this.select(bookshelf.knex.raw('products.id, b.name as brand_name, products.name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url' + (user ? ', b2.id  as bookmark_id' : '')));
            });
            qb.union(function () {
                if (user) {
                    this.joinRaw('LEFT JOIN user_bookmarks b2 ON b2.bookmark_id = products.id AND b2.user_id = ' + user.id + ' AND b2.bookmark_type = \'product\'');
                }

                if (filter) {
                    this.join('categories_products as cp1', 'cp1.product_id', '=', 'products.id');
                    this.join('categories as c1', 'cp1.category_id', '=', 'c1.id');
                    this.where('c1.path', '~', '*.' + filter + '.*');
                }

                this.join('brands as b', 'b.id', '=', 'products.brand_id');
                this.join('products_video_medias as pvm', 'products.id', '=', 'pvm.product_id');
                this.join('video_medias as vm1', 'pvm.video_media_id', '=', 'vm1.id');
                this.where('vm1.id', '=', id);
                this.from('products');
                this.select(bookshelf.knex.raw('products.id, b.name as brand_name, products.name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url' + (user ? ', b2.id  as bookmark_id' : '')));
            });
            qb.orderByRaw('2');
        });
    },
    getLastProducts: function (id, user, limit) {
        return this.query(function (qb) {
            if (user) 
                qb.joinRaw('LEFT JOIN user_bookmarks b1 ON b1.bookmark_id = products.id AND b1.user_id = ' + user.id + ' AND b1.bookmark_type = \'product\'');            

            qb.join('brands as b', 'b.id', '=', 'products.brand_id');
            qb.limit(limit ? limit : 4);
            qb.orderBy('created_at', 'desc');
            qb.where('products.id', '<>', id);
            qb.select(bookshelf.knex.raw('products.id, products.name, b.name as brand_name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url' + (user ? ', b1.id  as bookmark_id' : '')));
        }).fetchAll();
    }
});

module.exports = bookshelf.model('Product', Product);