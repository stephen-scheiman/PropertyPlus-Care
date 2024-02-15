const { Sequelize } = require('sequelize');

const URL = process.env.JAWS_DB || process.env.DB_URL;

const sequelize = new Sequelize(URL);

module.exports = sequelize;