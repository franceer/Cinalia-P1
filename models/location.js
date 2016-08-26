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
            return 'location';
        },
        displayType: function () {
            return 'lieu';
        },
        sectionUrl: function () {
            return 'locations';
        },
        urlRewrite: function () {
            return helper.toURLFormat(this.get('name'));
        }
    }
},
{
    getAllLocationsByMediaID: function (id, user) {
        return this.query(function (qb) {
            if (user) {
                qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = locations.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'location\'');
            }      

            qb.join('locations_video_medias as lvm', 'locations.id', '=', 'lvm.location_id');
            qb.join('video_medias as vm', 'lvm.video_media_id', '=', 'vm.id');
            qb.where('vm.id', '=', id);
            qb.select(bookshelf.knex.raw('locations.id, locations.name, locations.description, locations.picture_url, locations.picture_alt, locations.picture_title, \'locations\' as section_url' + (user ? ', b.id as bookmark_id' : '')));           
            qb.orderByRaw('2');
        });
    },
    getLastLocations: function (id, limit) {
        return this.query(function (qb) {
            qb.limit(limit ? limit : 4);
            qb.orderBy('created_at', 'desc');
            qb.where('id', '<>', id);
        }).fetchAll();
    }
});

module.exports = bookshelf.model('Location', Location);