const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Owner = require('./Owners');

class Property extends Model {}

Property.init(
  {
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    property_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    property_street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [5,5],
      },
    },
    owner_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Owner,
        key: 'owner_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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

module.exports = Property;