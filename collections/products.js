'use strict';

let Product = require('../models/product')
, bookshelf = require('../database/database');

let Products = bookshelf.Collection.extend({
    model: Product
});

module.exports = bookshelf.collection('Products', Products);