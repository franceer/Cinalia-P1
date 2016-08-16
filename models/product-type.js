'use strict';

let bookshelf = require('../database/database');

require('./product');

var ProductType = bookshelf.Model.extend({
    tableName: 'product_types',
    hasTimestamps: false,

    products: function () {
        return this.hasMany('Product');
    }    
});

module.exports = bookshelf.model('ProductType', ProductType);