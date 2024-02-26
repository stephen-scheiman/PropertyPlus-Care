const { findOpenIssues } = require('../utils/queries/issues')
const { findOpenTasksDueToday, findOpenTasksPastDue } = require('../utils/queries/tasks')
const { findProperties } = require('../utils/queries/properties')
const { findAllVendors } = require('../utils/queries/vendors')
const { findOwners } = require('../utils/queries/owners')
const { findUserByPk } = require('../utils/queries/users');


async function renderHome(req, res) {
  const { user_id } = req.session;

  // calling two promises but not awaiting them individually
  // 3rd line of code awaits both promises before continuing.
  // Only works when the two promises are independent of each other.
  const p1 = findUserByPk(user_id);
  const p2 = findOpenTasksPastDue();
  const p3 = findOpenTasksDueToday();
  const [user, pastTasks, todayTasks] = await Promise.all([p1, p2, p3]);

  res.status(200).render('task-aside', { pastTasks, todayTasks, user, });
}

async function renderAside(req, res) {
  const { model } = req.query;
  const isOob = true;

  // console.log('\n\n', model, '\n\n');

  switch (model) {
    case 'task': {
      const p1 = findOpenTasksPastDue();
      const p2 = findOpenTasksDueToday();
      const [pastTasks, todayTasks] = await Promise.all([p1, p2]);
      return res.status(200).render('task-aside', {pastTasks, todayTasks, isOob, layout: false});
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

function renderCancel(req, res) {
  res.status(200).send('');
}

module.exports = {
  renderHome,
  renderAside,
  redirectHome,
  renderCancel
};