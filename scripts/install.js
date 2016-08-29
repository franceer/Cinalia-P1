//Setup env
require('dotenv').config();
var bookshelf = require('../database/database');

bookshelf.knex.migrate.latest()
.then(function () {
    return bookshelf.knex.seed.run();
}).then(function () {
    process.exit();
});
