'use strict';

module.exports = {
  development: {
      client: 'pg',
      connection: {
          host: '127.0.0.1',
          database: 'PickedIn2',
          user: 'postgres',
          password: 'password',
          charset: 'utf8'
      },
      //pool: {
      //    min: 2,
      //    max: 10
      //},
      migrations: {
          directory: './database/migrations',
          tableName: 'knex_migrations'
      },
      seeds: {
          directory: './database/seeds'
      }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'PickedIn2',
      user: 'postgres',
      password: 'password',
      charset: 'utf8'
    },
    //pool: {
    //  min: 2,
    //  max: 10
    //},
    migrations: {
        directory: './database/migrations',
        tableName: 'knex_migrations'
    }
  }
};
