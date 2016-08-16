'use strict';

let bookshelf = require('../database/database');

require('./video-media');
require('./product');
require('./media-character');

let Look = bookshelf.Model.extend({
    tableName: 'looks',
    hasTimestamps: true,
	
	character: function(){
		return this.belongsTo('MediaCharacter');
	},

    videoMedia: function () {
        return this.belongsTo('VideoMedia');
    },

    products: function () {
        return this.belongsToMany('Product').through('ProductsInLook');
    },

    virtuals: {
        type: function() {
            return 'Look';
        },
        sectionUrl: function () {
            return 'looks';
        }
    }    
});

module.exports = bookshelf.model('Look', Look);