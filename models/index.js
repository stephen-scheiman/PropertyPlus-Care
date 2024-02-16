const User = require("./Users");
const Owner = require("./Owners");
const Property = require("./Properties");
const Issue = require("./Issues");
const Task = require("./Tasks");
const Vendor = require("./Vendors");
const VendorIssue = require("./Vendor_issues");


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

Issue.hasMany(Task, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
}});
Task.belongsTo(Issue);

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
  Task,
  Vendor,
  VendorIssue,
}