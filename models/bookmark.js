'use strict';

let bookshelf = require('../database/database');

require('./user');

var Bookmark = bookshelf.Model.extend({
    tableName: 'user_bookmarks',
    hasTimestamps: false,

    User: function () {
        return this.belongsTo('User');
    }    
});

module.exports = bookshelf.model('Bookmark', Bookmark);