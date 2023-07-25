// Loads and sets up sequelize
const Sequelize = require('sequelize');
const ModelCreator = require('./models');

const environment = process.env.NODE_ENV || 'development';

const config = require('./sequelize/config/config')[environment];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: false,
});


module.exports = ModelCreator(sequelize);