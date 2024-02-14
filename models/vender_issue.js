const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class VendorIssue extends Model {}

VendorIssue.init(
  {
    vender_issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'vender_issue',
  }
);

module.exports = VendorIssue;