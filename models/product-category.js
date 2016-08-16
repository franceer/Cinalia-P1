'use strict';

let bookshelf = require('../database/database');

require('./product');

var ProductCategory = bookshelf.Model.extend({
    tableName: 'product_categories',
    hasTimestamps: false,

    products: function () {
        return this.belongsToMany('Product');
    }
});

module.exports = bookshelf.model('ProductCategory', ProductCategory);