const { User } = require('../../models');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

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
  const { user_email, user_password } = req.body;

  const userData = await User.findOne({ where: {email: user_email}});

  if (!userData) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  // checkPassword -- VS Code says it doesn't return promise, no await needed.
  // Is this because we are using "compareSync" in our checkPassword method? versus just compare?
  const validPassword = userData.checkPassword(user_password);

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
    // should this be a 404? or a BadRequestError?
    throw new NotFoundError("Logout Failed");
  }
};

module.exports = { createUser, userLogin, userLogout };