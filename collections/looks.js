'use strict';

let Look = require('../models/look')
, bookshelf = require('../database/database');

let Looks = bookshelf.Collection.extend({
    model: Look
});

module.exports = bookshelf.collection('Looks', Looks);