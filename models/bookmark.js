'use strict';

let bookshelf = require('../database/database'),
Promise = require('bluebird');

require('./user');

var Bookmark = bookshelf.Model.extend({
    tableName: 'user_bookmarks',
    hasTimestamps: false,

    User: function () {
        return this.belongsTo('User');
    }    
},
{
    getAllBookmarksForUser: Promise.method(function (userID) {
        return bookshelf.knex
        .where('user_id', '=', userID)
        .where('bookmark_type', '=', 'video media')
        .join('video_medias as vm', 'user_bookmarks.bookmark_id', '=', 'vm.id')
        .from('user_bookmarks')
        .select(bookshelf.knex.raw('user_bookmarks.bookmark_id, user_bookmarks.bookmark_type, vm.id, vm.name, vm.description, vm.poster_url as picture_url, vm.poster_alt as picture_alt, vm.poster_title as picture_title, \'/movies/\' || vm.id as url'))
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('bookmark_type', '=', 'look');
            this.join('looks as l', 'user_bookmarks.bookmark_id', '=', 'l.id');
            this.from('user_bookmarks');
            this.select(bookshelf.knex.raw('user_bookmarks.bookmark_id, user_bookmarks.bookmark_type, l.id, l.name, l.description, NULL, NULL, NULL, \'/looks/\' || l.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('bookmark_type', '=', 'set');
            this.join('sets as s', 'user_bookmarks.bookmark_id', '=', 's.id');
            this.from('user_bookmarks');
            this.select(bookshelf.knex.raw('user_bookmarks.bookmark_id, user_bookmarks.bookmark_type, s.id, s.name, s.description, s.picture_url, s.picture_alt, s.picture_title, \'/sets/\' || s.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('bookmark_type', '=', 'product');
            this.join('products as p', 'user_bookmarks.bookmark_id', '=', 'p.id');
            this.from('user_bookmarks');
            this.select(bookshelf.knex.raw('user_bookmarks.bookmark_id, user_bookmarks.bookmark_type, p.id, p.name, p.description, p.picture_url, p.picture_alt, p.picture_title, \'/products/\' || p.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('bookmark_type', '=', 'location');
            this.join('locations as loc', 'user_bookmarks.bookmark_id', '=', 'loc.id');
            this.from('user_bookmarks');
            this.select(bookshelf.knex.raw('user_bookmarks.bookmark_id, user_bookmarks.bookmark_type, loc.id, loc.name, loc.description, loc.picture_url, loc.picture_alt, loc.picture_title, \'/locations/\' || loc.id as url'));
        });
    }),
    areBookmarked: function (assets, user) {
        return this.query(function(qb){
            for(var i = 0; i < assets.length; i++){
                var asset = assets[i]

                if(i === 0)
                    qb.where({ user_id: user.id, bookmark_id: asset.id, bookmark_type: asset.type });
                else
                    qb.orWhere({ user_id: user.id, bookmark_id: asset.id, bookmark_type: asset.type });
            }
        })
        .fetchAll()
        .then(function(results){
            var bookmarks = results.toJSON();
            var newAssets = [];
            assets.forEach(function (asset) {
                bookmarks.some(function (bookmark, index) {
                    var bool = (bookmark.bookmark_id === asset.id && bookmark.bookmark_type === asset.type);

                    if (bool) 
                        asset.bookmark_id = true;

                    return bool;                    
                });

                newAssets.push(asset);
            });

            return newAssets;
        })
    }  
});

module.exports = bookshelf.model('Bookmark', Bookmark);