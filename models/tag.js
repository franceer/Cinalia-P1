'use strict';

var bookshelf = require('../database/database');
require('./video-media');
require('./product');
require('./set');
require('./look');
require('./location');

var Tag = bookshelf.Model.extend({
    tableName: 'tags',
    hasTimestamps: false,

    videoMedias: function () {
        return this.belongsToMany('VideoMedia');
    },

    products: function () {
        return this.belongsToMany('Product');
    },

    sets: function () {
        return this.belongsToMany('Set');
    },

    looks: function () {
        return this.belongsToMany('Look');
    },

    locations: function () {
        return this.belongsToMany('Location');
    }   
},
{
    getAssetsByTagPath: function (tagPath, user) {
        return {
            Films: function () {
                return require('./video-media').query(function (qb) {
                    if (user) 
                        qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = video_medias.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'video media\'');                    

                    qb.join('tags_video_medias as cv', 'video_medias.id', '=', 'cv.video_media_id');
                    qb.join('tags as t', 'cv.tag_id', '=', 't.id');
                    qb.where('t.path', '~', '*.' + tagPath + '.*');
                    qb.select(bookshelf.knex.raw('video_medias.id, video_medias.name, video_medias.description, video_medias.poster_url as picture_url, video_medias.poster_alt as picture_alt, video_medias.poster_title as picture_title, \'movies\' as section_url' + (user ? ', b.id as bookmark_id' : '')));
                }).orderBy('video_medias.created_at', 'DESC');
            },
            Produits: function () {
                return require('./product').query(function (qb) {
                    if (user) 
                        qb.joinRaw('LEFT JOIN user_bookmarks b1 ON b1.bookmark_id = products.id AND b1.user_id = ' + user.id + ' AND b1.bookmark_type = \'product\'');                    

                    qb.join('brands as b', 'b.id', '=', 'products.brand_id');
                    qb.join('products_tags as pt', 'products.id', '=', 'pt.product_id');
                    qb.join('tags as t', 'pt.tag_id', '=', 't.id');
                    qb.where('t.path', '~', '*.' + tagPath + '.*');
                    qb.orderByRaw('(products.created_at, products.id) DESC');
                    qb.select(bookshelf.knex.raw('products.id, \'<span>\' || b.name || \'</span> \' || products.name  as name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url' + (user ? ', b1.id as bookmark_id' : '')));
                });
            },
            Lieux: function () {
                return require('./location').query(function (qb) {
                    if (user) 
                        qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = locations.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'location\'');                    

                    qb.join('locations_tags as loct', 'locations.id', '=', 'loct.location_id');
                    qb.join('tags as t', 'loct.tag_id', '=', 't.id');
                    qb.where('t.path', '~', '*.' + tagPath + '.*');
                    qb.orderBy('created_at', 'desc');
                    qb.select(bookshelf.knex.raw('locations.id, locations.name, locations.description, locations.picture_url, locations.picture_alt, locations.picture_title, \'locations\' as section_url' + (user ? ', b.id as bookmark_id' : '')));
                });
            },
            Looks: function () {
                return require('./look').query(function (qb) {
                    if (user)
                        qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = looks.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'look\'');

                    qb.join('looks_tags as lt', 'looks.id', '=', 'lt.look_id');
                    qb.join('tags as t', 'lt.tag_id', '=', 't.id');
                    qb.where('t.path', '~', '*.' + tagPath + '.*');
                    qb.orderBy('created_at', 'desc');
                    qb.select(bookshelf.knex.raw('looks.id, looks.name, looks.description, NULL, NULL, NULL, \'looks\' as section_url' + (user ? ', b.id as bookmark_id' : '')));
                });
            },
            Décors: function () {
                return require('./set').query(function (qb) {
                    if (user)
                        qb.joinRaw('LEFT JOIN user_bookmarks b ON b.bookmark_id = sets.id AND b.user_id = ' + user.id + ' AND b.bookmark_type = \'set\'');

                    qb.join('sets_tags as st', 'sets.id', '=', 'st.set_id');
                    qb.join('tags as t', 'st.tag_id', '=', 't.id');
                    qb.where('t.path', '~', '*.' + tagPath + '.*');
                    qb.orderBy('created_at', 'desc');
                    qb.select(bookshelf.knex.raw('sets.id, sets.name, sets.description, sets.picture_url, sets.picture_alt, sets.picture_title, \'sets\' as section_url' + (user ? ', b.id as bookmark_id' : '')));
                });
            }
        };
    },
    searchTags: function(term, page) {
        var terms = term.replace(/\s\s+/g, ' ').trim().split(' ');
        var termsQuery = '';
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            termsQuery += term + (i === terms.length - 1 ? '*@' : '*@ | ');
        }

        return this.query(function (qb) {
            qb.whereRaw('path @ \'' + termsQuery + '\'')
        }).fetchPage({
            pageSize: 30,
            page: parseInt(page)
        });
    }
});

module.exports = bookshelf.model('Tag', Tag);