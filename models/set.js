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
    getLastSets: function (id, user, limit) {
        return this.query(function (qb) {
            if (user)
                qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = sets.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'set\'');

            qb.join('video_medias as vm', 'vm.id', '=', 'sets.video_media_id');
            qb.limit(limit ? limit : 4);
            qb.orderBy('sets.created_at', 'desc');
            qb.where('sets.id', '<>', id);
            qb.select(bookshelf.knex.raw('sets.id, sets.name, vm.name as video_media_name, sets.description, sets.picture_url, sets.picture_alt, sets.picture_title, \'sets\' as section_url' + (user ? ', b.id  as bookmark_id' : '')));
        }).fetchAll();
    }
});

module.exports = bookshelf.model('Set', Set);