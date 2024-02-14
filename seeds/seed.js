const sequelize = require('../config/connection');
const { 
  User,
  Issue,
  Owner,
  Property,
  Task,
  Vendor
} = require('../models');

const userData = require('./userData.json');
const issueData = require('./issueData.json');
const ownerData = require('./ownerData.json');
const propertyData = require('./propertyData.json');
const taskData = require('./taskData.json');
const vendorData = require('./vendorData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Issue.bulkCreate(issueData, {});

  await Owner.bulkCreate(ownerData, {});
  await Property.bulkCreate(propertyData, {});
  await Task.bulkCreate(taskData, {});
  await Vendor.bulkCreate(vendorData, {});

  process.exit(0);
};

seedDatabase();