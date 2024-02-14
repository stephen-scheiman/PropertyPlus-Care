const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vendor extends Model {}

Vendor.init(
  {
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendor_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor_trade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelname: 'vendor',
  }
);

module.exports = Vendor;