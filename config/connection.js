const { Sequelize } = require('sequelize');

const URL = process.env.JAWSDB_URL || process.env.DB_URL;

const sequelize = new Sequelize(URL);

module.exports = sequelize;