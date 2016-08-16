'use strict';

let User = require('../models/user')
, bookshelf = require('../database/database');

let Users = bookshelf.Collection.extend({
    model: User
});

module.exports = bookshelf.collection('Users', Users);