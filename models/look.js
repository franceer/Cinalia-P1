'use strict';

let bookshelf = require('../database/database'), 
    helper = require('../helpers/helper');

require('./video-media');
require('./product');
require('./category');
require('./media-character');

let Look = bookshelf.Model.extend({
    tableName: 'looks',
    hasTimestamps: true,
	
	character: function(){
		return this.belongsTo('MediaCharacter');
	},

	categories: function () {
	    return this.belongsToMany('Category');
	},

    videoMedia: function () {
        return this.belongsTo('VideoMedia');
    },

    products: function () {
        return this.belongsToMany('Product').through('ProductsInLook');
    },

    virtuals: {
        type: function() {
            return 'look';
        },
        displayType: function () {
            return 'look';
        },
        sectionUrl: function () {
            return 'looks';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }    
},
{
    getLastLooks: function (id, limit) {
        return this.query(function (qb) {
            qb.limit(limit ? limit : 4);
            qb.orderBy('created_at', 'desc');
            qb.where('id', '<>', id);
        }).fetchAll({ withRelated: ['videoMedia'] });
    }
});

module.exports = bookshelf.model('Look', Look);