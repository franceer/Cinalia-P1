'use strict';

var config = require('./knexfile.js');
var env = process.env.NODE_ENV;
var knex = require('knex')(config[env]);

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-modelbase').pluggable);
bookshelf.plugin('registry');
bookshelf.plugin('pagination');
bookshelf.plugin('virtuals');
module.exports = bookshelf;

knex.migrate.latest();