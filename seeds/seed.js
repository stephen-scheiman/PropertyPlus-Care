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

  for (const project of projectData) {
    await .create({
      ...project,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();