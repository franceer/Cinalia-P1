'use strict';

let bookshelf = require('../database/database');

require('./product');
require('./set');
require('./matching-status');

let ProductsInSet = bookshelf.Model.extend({
    tableName: 'products_sets',
    hasTimestamps: false,
   
    product: function () {
        return this.belongsTo('Product');
    },

    mediaSet: function () {
        return this.belongsTo('Set');
    },

    matchingStatus: function () {
        return this.belongsTo('MatchingStatus', 'matching_status_id');
    }
});

module.exports = bookshelf.model('ProductsInSet', ProductsInSet);