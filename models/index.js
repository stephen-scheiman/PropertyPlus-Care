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
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Property.belongsTo(Owner, {
  foreignKey: {
    name: 'owner_id',
    allowNull: false,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});


Property.hasMany(Issue, {
  foreignKey: {
    name: 'property_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Issue.belongsTo(Property, {
  foreignKey: {
    name: 'property_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


Issue.hasMany(Task, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Task.belongsTo(Issue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


Property.hasMany(Task, {
  foreignKey: {
    name: "property_id",
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Task.belongsTo(Property, {
  foreignKey: {
    name: "property_id",
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// SMM association
Vendor.belongsToMany(Issue, {
  through: VendorIssue,
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Issue.belongsToMany(Vendor, {
  through: VendorIssue,
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Vendor.hasMany(VendorIssue, {
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
VendorIssue.belongsTo(Vendor, {
  foreignKey: {
    name: 'vendor_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Issue.hasMany(VendorIssue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
VendorIssue.belongsTo(Issue, {
  foreignKey: {
    name: 'issue_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
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