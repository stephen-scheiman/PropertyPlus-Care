const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Owner extends Model {}

Owner.init(
  {
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    owner_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'owner',
  }
);

module.exports = Owner;