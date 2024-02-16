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
Property.belongsTo(Owner, {
  foreignKey: {
    name: 'owner_id',
    allowNull: false,
}});


Property.hasMany(Issue, {
  foreignKey: {
    name: 'property_id',
    allowNull: false,
}});
Issue.belongsTo(Property, {
  foreignKey: {
    name: 'property_id',
    allowNull: false,
}});


Issue.hasMany(Task, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
}});
Task.belongsTo(Issue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
}});


Property.hasMany(Task, {
  foreignKey: {
    name: "property_id",
    allowNull: false,
  }
});
Task.belongsTo(Property, {
  foreignKey: {
    name: "property_id",
    allowNull: false,
  }
});

// SMM association
Vendor.belongsToMany(Issue, {
  through: VendorIssue,
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  }
});
Issue.belongsToMany(Vendor, {
  through: VendorIssue,
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  }
});
Vendor.hasMany(VendorIssue, {
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  }
});
VendorIssue.belongsTo(Vendor, {
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  }
});
Issue.hasMany(VendorIssue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  }
});
VendorIssue.belongsTo(Issue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  }
});


module.exports = {
  User,
  Owner,
  Property,
  Issue,
  Task,
  Vendor,
  VendorIssue,
}