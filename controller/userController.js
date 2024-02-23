const { User } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { userLogin } = require('../utils/queries/users')
const { getAllTasks } = require('../utils/queries/tasks')

async function renderLoginForm(req, res) {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login', {layout: 'main-login'});
};

async function renderLoggedInHome(req, res) {
  const { user_email, user_password } = req.body;
  console.log(user_email, user_password, "\n\n");
  const p1 = userLogin({user_email, user_password});
  const p2 = getAllTasks();

  const [user, taskData] = await Promise.all([p1, p2]);
  console.log(user, taskData, "\n\n");
  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.user_id = user.user_id;

    res.status(200).render('homepage', {taskData})
  })
};

async function createUser(req, res) {
  const { user_name, user_email, user_password } = req.body;

  if (!(user_name && user_email && user_password)) {
    throw new BadRequestError('Missing Data - Please fill out all required fields.');
  }

  const newUser = await User.create({
    user_name,
    user_email,
    user_password
  });

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.user_id = newUser.user_id;
    // if api send json IF htmx send html / render
    res.status(200).json(newUser);
  });
};

async function userLogin1(req, res) {
  const { user_email, user_password } = req.body;

  const userData = await User.findOne({ where: {email: user_email}});

  if (!userData) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  const validPassword = await userData.checkPassword(user_password);

  if (!validPassword) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  req.session.save(() => {
    req.session.user_id = userData.user_id;
    req.session.logged_in = true;

    res.status(200).json(userData);
  })
};

async function userLogout(req, res) {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    throw new BadRequestError("You are not logged in.");
  }
};

module.exports = {
  createUser,
  userLogin,
  userLogout,
  renderLoginForm,
  renderLoggedInHome
};