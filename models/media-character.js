'use strict';

let bookshelf = require('../database/database');

require('./look');
require('./character-type');

var MediaCharacter = bookshelf.Model.extend({
    tableName: 'media_characters',
    hasTimestamps: false,
	
	type: function(){
		return this.belongsTo('CharacterType');
	},
	
    look: function () {
        return this.hasOne('Look');
    }    
});

module.exports = bookshelf.model('MediaCharacter', MediaCharacter);