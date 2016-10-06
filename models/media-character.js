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
},
{
    searchCharacters: function(term, page) {
        var terms = term.replace(/\s\s+/g, ' ').trim().split(' ');
        var termsQuery = '\'';
        for (var i = 0; i < terms.length; i++) {
            var term = '%' + terms[i] + '%';
            termsQuery += term + (i === terms.length - 1 ? '\'' : '|');
        }

        return this.query(function (qb) {
            qb.whereRaw('firstname SIMILAR TO ' + termsQuery + ' OR lastname SIMILAR TO ' + termsQuery + ' OR nickname SIMILAR TO ' + termsQuery)
        }).fetchPage({
            pageSize: 30,
            page: parseInt(page)
        });
    }
});

module.exports = bookshelf.model('MediaCharacter', MediaCharacter);