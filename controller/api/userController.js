const { User } = require('../../models');
const { BadRequestError } = require('../../utils/errors');

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

// enter additional user functions below
async function userLogin(req, res) {

};

async function userLogout(req, res) {

};

module.exports = { createUser, userLogin, userLogout };