const { Task, User, Property } = require('../models');
const { Op } = require('sequelize');
const { findOpenIssues } = require('../utils/queries/issues')
const { findOpenTasks, findOpenTasksByDueDate, findTasksDueToday } = require('../utils/queries/tasks')
const { findProperties } = require('../utils/queries/properties')
const { findAllVendors } = require('../utils/queries/vendors')
const { findOwners } = require('../utils/queries/owners')
const { findUserByPk } = require('../utils/queries/users');
// const { BadRequestError } = require('../utils/errors/');


// homepage loads all current and past due Tasks
async function renderHome(req, res) {
  const { user_id } = req.session;

  // calling two promises but not awaiting them individually
  // 3rd line of code awaits both promises before continuing.
  // Only works when the two promises are independent of each other.
  const p1 = findUserByPk(user_id);
  const p2 = findOpenTasksByDueDate();
  const p3 = findTasksDueToday();
  const [user, pastTasks, todayTasks] = await Promise.all([p1, p2, p3]);

  console.log('\n\n homecontroller \n\n');
  console.log('\npastTasks', pastTasks);
  console.log('\ntodayTasks', todayTasks);

  // this needs to be completed when we know what the homepage will look like
  res.status(200).render('task-aside', { pastTasks, todayTasks, user, });
}

async function renderAside(req, res) {
  const { model } = req.query;
  const isOob = true;

  console.log('\n\n', model, '\n\n');

  switch (model) {
    case 'task': {
      const tasks = await findOpenTasksByDueDate();
      return res.status(200).render('task-aside', {tasks, isOob, layout: false});
    }

    case 'issues': {
      const issues = await findOpenIssues();
      return res.status(200).render('issue-aside', { issues, isOob, layout: false });
    }

    case 'property': {
      const properties = await findProperties();
      return res.status(200).render('property-aside', { properties, isOob, layout: false });
    }

    case 'vendor': {
      const vendors = await findAllVendors();
      return res.status(200).render('vendor-aside', { vendors, isOob, layout: false });
    }

    case 'owner': {
      const owners = await findOwners();
      return res.status(200).render('owner-aside', { owners, isOob, layout: false });
    }

    default:
      break;
  }
}

function redirectHome(req, res) {
  res.status(200).set('hx-redirect', '/').end();
}


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
      },
      is_done: false,
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




module.exports = {
  renderHome,
  renderAside,
  redirectHome,
};