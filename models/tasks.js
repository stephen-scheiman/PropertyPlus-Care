const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Task extends Model {}

Task.init(
  {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    status_update: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    followUp_date: {
      type: DataTypes.DATE,
      allowNull: false,
      },

    is_done: {
    type: DataTypes.BOOLEAN,
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

module.exports = Tasks;