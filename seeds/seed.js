const sequelize = require('../config/connection');
const {
  User,
  Owner,
  Property,
  Issue,
  Task,
  Vendor,
  VendorIssue
} = require('../models');

const userData = require('./userData.json');
const issueData = require('./issueData.json');
const ownerData = require('./ownerData.json');
const propertyData = require('./propertyData.json');
const taskData = require('./taskData.json');
const vendorData = require('./vendorData.json');
const vendorIssueData = require('./vendorIssueData.json')


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Vendor.bulkCreate(vendorData, {
    individualHooks: true,
    returning: true,
  });

  await Owner.bulkCreate(ownerData, {
    individualHooks: true,
    returning: true,
  });

  await Property.bulkCreate(propertyData, {
    individualHooks: true,
    returning: true,
  });

  await Issue.bulkCreate(issueData, {
    individualHooks: true,
    returning: true,
  });

  await Task.bulkCreate(taskData, {
    individualHooks: true,
    returning: true,
  });

  await VendorIssue.bulkCreate(vendorIssueData, {
    individualHooks: true,
    returning: true,
  })

  process.exit(0);
};

seedDatabase();