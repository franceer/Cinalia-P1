'use strict';

let bookshelf = require('../database/database');

require('./media-character');

var CharacterType = bookshelf.Model.extend({
    tableName: 'character_types',
    hasTimestamps: false,

    character: function () {
        return this.hasMany('MediaCharacter');
    }    
});

module.exports = bookshelf.model('CharacterType', CharacterType);