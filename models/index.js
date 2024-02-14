const User = require("./users");
const Owner = require("./owners");
const Property = require("./properties");
const Issue = require("./issues");
const Tasks = require("./tasks");
const Vendor = require("./vendors");
const VendorIssue = require("./vender_issue");


Owner.hasMany(Property, {
  foreignKey: {
    name: 'owner_id',
    allowNull: false,
}});
Property.belongsTo(Owner);

Property.hasMany(Issue, {
  foreignKey: {
    name: 'property_id',
    allowNull: false,
}});
Issue.belongsTo(Property);

Issue.hasMany(Tasks, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
}});
Tasks.belongsTo(Issue);

// SMM association
Vendor.belongsToMany(Issue, { through: VendorIssue , sourceKey: 'vendor_id', targetKey: 'issue_id'});
Issue.belongsToMany(Vendor, { through: VendorIssue , sourceKey: 'issue_id', targetKey: 'vendor_id'});
Vendor.hasMany(VendorIssue);
VendorIssue.belongsTo(Vendor);
Issue.hasMany(VendorIssue);
VendorIssue.belongsTo(Issue);


module.exports = {
  User,
  Owner,
  Property,
  Issue,
  Tasks,
  Vendor,
  VendorIssue,
}