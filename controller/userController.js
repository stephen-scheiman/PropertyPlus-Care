const { User } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { updateUser, userLogin, createUser, findUserByPk, findUsers } = require('../utils/queries/users')

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
  let { user_name, user_password, user_email } = req.body;

  if (!(user_name && user_email && user_password)) {
    throw new BadRequestError('signup', 'Missing Data - Please fill out all required fields.');
  }

  //validate letters and numbers only in username
  user_name = user_name.trim();
  const namePattern = /^[a-zA-Z0-9]+$/;
  //validate properly formed email
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //password comlexity validation
  const passwordPattern = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  if (
    !namePattern.test(user_name)
  ) {
    throw new BadRequestError('signup', "Your username should only contain letters and numbers");
  }

  if (
    !emailPattern.test(user_email)
  ) {
    throw new BadRequestError('signup', "Please enter a valid email address");
  }

  //validate that the email is unique
  const userData = await findUsers();
  for (x = 0; x < userData.length; x++) {
    if (user_email === userData[x].user_email) {
      throw new BadRequestError(
        "An user with this email address already exists",
      );
    }
  }

  // if (
  //   !passwordPattern.test(user_password)
  // ) {
  //   throw new BadRequestError('signup', "Your password must consist of 8 characters and contain uppercase and lowercase characters as well as a symbol and a number")
  // }

  const user = await createUser({ user_name, user_password, user_email });

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.user_id = user.user_id;

    res.status(201).set('hx-redirect', '/').end();
  })
}

async function renderLoggedOut(req, res) {
  if (req.session.loggedIn) {
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

function renderUserEditForm(req, res) {
  res.status(200).render('user-form-edit', { layout: false });
}

async function renderEditedUser(req, res) {
  const { user_id } = req.session;
  const { user_email, user_name, user_password } = req.body;
  const userData = {};

  if (user_email) { userData.user_email = user_email };
  if (user_name) { userData.user_name = user_name };
  if (user_password) { userData.user_password = user_password };

  const result = await updateUser(user_id, userData);
  const user = await findUserByPk(user_id);

  res.status(200).render('user-id', { user, layout: false});
}

module.exports = {
  renderLoginForm,
  renderLoggedInHome,
  renderSignupForm,
  renderNewUser,
  renderLoggedOut,
  renderCurrentUser,
  renderUserEditForm,
  renderEditedUser,
};