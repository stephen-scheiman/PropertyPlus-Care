const sequelize = require('../config/connection');
const { users, issues, owners, properties, tasks, vendors } = require('../models');

const userData = require('./userData.json');
const issueData = require('./issueData.json');
const ownerData = require('./ownerData.json');
const propertyData = require('./propertyData.json');
const taskData = require('./taskData.json');
const vendorData = require('./vendorData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

await users.bulkCreate(userData, {
  individualHooks: true,
  returning: true,
});

  await issues.bulkCreate(issueData, {});
  await owners.bulkCreate(ownerData, {});
  await properties.bulkCreate(propertyData, {});
  await tasks.bulkCreate(taskData, {});
  await vendors.bulkCreate(vendorData, {});

  process.exit(0);
};

seedDatabase();