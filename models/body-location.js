'use strict';

let bookshelf = require('../database/database');

require('./products-in-look');

let BodyLocation = bookshelf.Model.extend({
    tableName: 'body_locations',
    hasTimestamps: false,

    productsInLook: function () {
        return this.hasMany('ProductsInLook');
    }    
});

module.exports = bookshelf.model('BodyLocation', BodyLocation);