const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tasks extends Model {}

Tasks.init(
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
    modelName: 'property',
  }
);

module.exports = Tasks;