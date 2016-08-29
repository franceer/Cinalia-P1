//Setup env
require('dotenv').config({silent: true});
var bookshelf = require('../database/database');

bookshelf.knex.migrate.latest()
.then(function () {
    return bookshelf.knex.seed.run();
})
.then(function () {
    process.exit();
})
.catch(function (err) {
    console.log(err.message);
    process.exit(1);
});