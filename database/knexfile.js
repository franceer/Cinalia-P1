'use strict';

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            charset: 'utf8'
        },     
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
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            charset: 'utf8',
            ssl: true
        },   
        migrations: {
            directory: './database/migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './database/seeds'
        }
    }
};
