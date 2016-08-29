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
    getLastLooks: function (id, user, limit) {
        return this.query(function (qb) {
            if (user)
                qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = looks.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'look\'');

            qb.join('video_medias as vm', 'vm.id', '=', 'looks.video_media_id');
            qb.limit(limit ? limit : 4);
            qb.orderBy('looks.created_at', 'desc');
            qb.where('looks.id', '<>', id);
            qb.select(bookshelf.knex.raw('looks.id, looks.name, vm.name as video_media_name, looks.description, \'looks\' as section_url' + (user ? ', b.id  as bookmark_id' : '')));
        }).fetchAll();
    }
});

module.exports = bookshelf.model('Look', Look);