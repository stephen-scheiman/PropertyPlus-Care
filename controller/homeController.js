const { Task, User, Property } = require('../models');
const { Op } = require('sequelize');
const { findAllIssues } = require('../utils/queries/issues')
const { getAllTasks } = require('../utils/queries/tasks')
const { getAllProperties } = require('../utils/queries/properties')
const { } = require('../utils/queries/vendors')
const {findOwners } = require('../utils/queries/owners')
// const { BadRequestError } = require('../utils/errors/');

// async function userLogin(req, res) {
//   // If the user is already logged in, redirect the request to another route
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }
//   res.render('loginView');
// };

async function findTasks() {
  const taskData = await Task.findAll({
    where: {
      followUp_date: {
        [Op.lte]: Date.now()
      }
    },
    include: [{
      model: Property,
      attributes: ['property_id', 'property_name']
    }],
    // returning raw data - will test if this works
    raw: true,
    // telling it that the data returned will be nest
    nest: true,
  });
  return taskData;
};

/**
 *
 * @param {number} id user ID
 * @returns User model object
 */
async function getUser(id) {
  return (await User.findByPk(id));
};

// homepage loads all current and past due Tasks
async function renderHome(req, res) {
  const { user_id, logged_in } = req.session;

  // calling two promises but not awaiting them individually
  // 3rd line of code awaits both promises before continuing.
  // Only works when the two promises are independent of each other.
  const p1 = getUser(user_id);
  const p2 = findTasks();
  const [userData, taskData] = await Promise.all([p1,p2]);

  // this needs to be completed when we know what the homepage will look like
  res.status(200).render('homepage', { taskData });
}

async function renderAside(req, res) {
  const { model } = req.query;

  console.log('\n\n', model, '\n\n');

  switch (model) {
    case 'task': {
      const tasks = await getAllTasks();
      return res.status(200).render('task-main', {tasks, layout: false});
    }

    case 'issues': {
      const issues = await findAllIssues();
      return res.status(200).render('issue-main', {  issues, layout: false });
    }

    case 'property': {
      const properties = await getAllProperties();
      return res.status(200).render('property-main', { properties, layout: false });
    }

    case 'vendor': {
      return res.status(200).render('issue-main', { layout: false });
    }

    case 'owner': {
      return res.status(200).render('issue-main', { layout: false });
    }

    default:
      break;
  }
}


module.exports = {
  renderHome,
  renderAside
};