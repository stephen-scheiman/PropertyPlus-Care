const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Issue = require('./Issues');
const Property = require('./Properties');

class Task extends Model { }

Task.init(
  {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status_update: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    followUp_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },

    is_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: Issue,
        key: 'issue_id',
      },
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
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;