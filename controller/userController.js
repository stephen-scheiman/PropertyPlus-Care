const { User } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/errors');

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

async function userLogin(req, res) {
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

module.exports = { createUser, userLogin, userLogout };