const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Issue extends Model {}

Issue.init(
  {
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    issue_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_isDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: 'issue',
  }
);

module.exports = Issue;