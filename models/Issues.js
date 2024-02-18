const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Property = require('./Properties');

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
      defaultValue: false,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: Property,
        key: 'property_id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: 'issue',
  }
);

module.exports = Issue;