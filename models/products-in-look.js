'use strict';

let bookshelf = require('../database/database');

require('./product');
require('./look');
require('./matching-status');
require('./body-location');

let ProductsInLook = bookshelf.Model.extend({
    tableName: 'looks_products',
    hasTimestamps: false,

    product: function () {
        return this.belongsTo('Product');
    },

    look: function () {
        return this.belongsTo('Look');
    },

    matchingStatus: function () {
        return this.belongsTo('MatchingStatus', 'matching_status_id');
    },

    bodyLocation: function () {
        return this.belongsTo('BodyLocation');
    }
});

module.exports = bookshelf.model('ProductsInLook', ProductsInLook);