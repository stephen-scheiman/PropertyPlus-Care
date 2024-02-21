const { User } = require('../../models');
const { BadRequestError, NotFoundError } = require('../errors');

async function userLogin(userData) {

  const user = await User.findOne({ where: {user_email: userData.user_email}});

  if (!user) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  const validPassword = await user.checkPassword(userData.user_password);

  if (!validPassword) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }
  // console.log(user);
  return user;
};

module.exports = {
  userLogin,

}