'use strict';

let bookshelf = require('../database/database'),
Promise = require('bluebird');

require('./user');

var Like = bookshelf.Model.extend({
    tableName: 'user_likes',
    hasTimestamps: false,

    User: function () {
        return this.belongsTo('User');
    }    
},
{
    getAllLikesForUser: Promise.method(function (userID) {
        return bookshelf.knex
        .where('user_id', '=', userID)
        .where('target_type', '=', 'video media')
        .join('video_medias as vm', 'user_likes.target_id', '=', 'vm.id')
        .from('user_likes')
        .select(bookshelf.knex.raw('user_likes.target_id, user_likes.target_type, vm.id, vm.name, vm.description, vm.poster_url as picture_url, vm.poster_alt as picture_alt, vm.poster_title as picture_title, \'/movies/\' || vm.id as url'))
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('target_type', '=', 'look');
            this.join('looks as l', 'user_likes.target_id', '=', 'l.id');
            this.from('user_likes');
            this.select(bookshelf.knex.raw('user_likes.target_id, user_likes.target_type, l.id, l.name, l.description, NULL, NULL, NULL, \'/looks/\' || l.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('target_type', '=', 'set');
            this.join('sets as s', 'user_likes.target_id', '=', 's.id');
            this.from('user_likes');
            this.select(bookshelf.knex.raw('user_likes.target_id, user_likes.target_type, s.id, s.name, s.description, s.picture_url, s.picture_alt, s.picture_title, \'/sets/\' || s.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('target_type', '=', 'product');
            this.join('products as p', 'user_likes.target_id', '=', 'p.id');
            this.from('user_likes');
            this.select(bookshelf.knex.raw('user_likes.target_id, user_likes.target_type, p.id, p.name, p.description, p.picture_url, p.picture_alt, p.picture_title, \'/products/\' || p.id as url'));
        })
        .unionAll(function () {
            this.where('user_id', '=', userID);
            this.where('target_type', '=', 'location');
            this.join('locations as loc', 'user_likes.target_id', '=', 'loc.id');
            this.from('user_likes');
            this.select(bookshelf.knex.raw('user_likes.target_id, user_likes.target_type, loc.id, loc.name, loc.description, loc.picture_url, loc.picture_alt, loc.picture_title, \'/locations/\' || loc.id as url'));
        });
    })
});

module.exports = bookshelf.model('Like', Like);