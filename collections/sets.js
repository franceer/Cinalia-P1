'use strict';

let Set = require('../models/set')
, bookshelf = require('../database/database');

let Sets = bookshelf.Collection.extend({
    model: Set
});

module.exports = bookshelf.collection('Sets', Sets);