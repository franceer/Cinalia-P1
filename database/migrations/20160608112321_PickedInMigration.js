'use strict';

var config = require('../knexfile.js');
var env = 'development';
var knex = require('knex')(config[env]);
var schema = require('../schema');
var sequence = require('when/sequence');
var _ = require('lodash');

exports.up = function (knex, Promise) {
    return createTables()
    .then(function () {
        console.log('Tables created!!');
    })
    .catch(function (error) {
        throw error;
    });
};

exports.down = function(knex, Promise) {
    return dropTables()
    .then(function () {
        console.log('Tables dropped!!');
    })
    .catch(function (error) {
        throw error;
    });
};

function createTable(tableName) {
    return knex.schema.createTableIfNotExists(tableName, function (table) {
        var column;
        var columnKeys = _.keys(schema[tableName]);        

        _.each(columnKeys, function (key) {
            if (schema[tableName][key].type === 'text' && schema[tableName][key].hasOwnProperty('fieldtype')) {
                column = table[schema[tableName][key].type](key, schema[tableName][key].fieldtype);
            }
            else if (schema[tableName][key].type === 'string' && schema[tableName][key].hasOwnProperty('maxlength')) {
                column = table[schema[tableName][key].type](key, schema[tableName][key].maxlength);
            }
            else if (schema[tableName][key].type === 'specific' && schema[tableName][key].hasOwnProperty('specificType')) {
                column = table.specificType(key, schema[tableName][key].specificType);
            }
            else {
                column = table[schema[tableName][key].type](key);
            }
			
			if(schema[tableName][key].hasOwnProperty('primary')){
				column.primary();
			}			

            if (schema[tableName][key].hasOwnProperty('nullable') && schema[tableName][key].nullable === true) {
                column.nullable();
            }
            else {
                column.notNullable();
            }

            if (schema[tableName][key].hasOwnProperty('unique') && schema[tableName][key].unique) {
                column.unique();
            }

            if (schema[tableName][key].hasOwnProperty('unsigned') && schema[tableName][key].unsigned) {
                column.unsigned();
            }

            if (schema[tableName][key].hasOwnProperty('references') && schema[tableName][key].hasOwnProperty('inTable')) {
                column.references(schema[tableName][key].references).inTable(schema[tableName][key].inTable);
            }

            if (schema[tableName][key].hasOwnProperty('defaultTo')) {
                if (schema[tableName][key].defaultTo === 'now')
                    column.defaultTo(knex.raw('now()'));
                else
                    column.defaultTo(schema[tableName][key].defaultTo);
            }
        });
    });
}

function createTables() {
    var tables = [];
    var tableNames = _.keys(schema);
    tables = _.map(tableNames, function (tableName) {
        return function () {
            return createTable(tableName);
        };
    });

    return sequence(tables);
}

function dropTables() {
    var dropTasks = [];
    var tableNames = _.reverse(_.keys(schema));
    dropTasks = _.map(tableNames, function (tableName) {
        return function () {
            return knex.schema.dropTableIfExists(tableName);
        }
    });

    return sequence(dropTasks);
}
