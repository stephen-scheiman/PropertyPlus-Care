const { User } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { userLogin, createUser, findUserByPk } = require('../utils/queries/users')

async function renderLoginForm(req, res) {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.status(200).render('login', {layout: 'main-login'});
};

async function renderLoggedInHome(req, res) {
  const { user_email, user_password } = req.body;
  const user = await userLogin({ user_email, user_password });

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.user_id = user.user_id;

    res.status(200).set('hx-redirect', '/').end();
  })
};

async function renderSignupForm(req, res) {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.status(200).render('signup', {layout: 'main-login'});
}

async function renderNewUser(req, res) {
  const { user_name, user_password, user_email } = req.body;

  if (!(user_name && user_email && user_password)) {
    throw new BadRequestError('Missing Data - Please fill out all required fields.');
  }

  const user = await createUser({ user_name, user_password, user_email });

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.user_id = user.user_id;

    res.status(201).set('hx-redirect', '/').end();
  })
}

async function renderLoggedOut(req, res) {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).set('hx-redirect', '/login').end();
    });
  } else {
    throw new BadRequestError("You are not logged in.");
  }
};

async function renderCurrentUser(req, res) {
  const { user_id } = req.session;
  const user = await findUserByPk(user_id);
  res.status(200).render('user-id', { user, layout: false });
};

async function renderUserEditForm(req, res) {

}

module.exports = {
  renderLoginForm,
  renderLoggedInHome,
  renderSignupForm,
  renderNewUser,
  renderLoggedOut,
  renderCurrentUser,
  renderUserEditForm,
};