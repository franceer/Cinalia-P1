'use strict';

let bookshelf = require('../database/database');

require('./user');

var UserType = bookshelf.Model.extend({
    tableName: 'user_types',
    hasTimestamps: false,

    users: function () {
        return this.hasMany('User');
    }    
});

module.exports = bookshelf.model('UserType', UserType);