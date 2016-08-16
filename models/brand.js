'use strict';

let bookshelf = require('../database/database');

require('./product');

var Brand = bookshelf.Model.extend({
    tableName: 'brands',
    hasTimestamps: false,

    products: function () {
        return this.hasMany('Product');
    }    
});

module.exports = bookshelf.model('Brand', Brand);