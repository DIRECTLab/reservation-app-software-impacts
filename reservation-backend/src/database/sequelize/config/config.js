require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    database: 'databaseName',
    username: 'databaseUser',
    password: 'databasePass',
    dialect: 'sqlite',
    storage: path.join(__dirname, '../..', 'sqlite/development.sqlite'),
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
}