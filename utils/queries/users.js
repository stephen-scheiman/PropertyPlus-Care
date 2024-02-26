const { User } = require('../../models');
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors');

async function userLogin(userData) {

  const user = await User.findOne({ where: {user_email: userData.user_email}});

  if (!user) {
    throw new BadRequestError('login', "Incorrect email or password, please try again or register a new account");
  }

  const validPassword = await user.checkPassword(userData.user_password);

  if (!validPassword) {
    throw new BadRequestError('login', "Incorrect email or password, please try again or register a new account");
  }
  // console.log(user);
  return user;
};

async function findUsers() {
  const users = await User.findAll();
  return users;
}

async function createUser(userData) {
  const user = await User.create(userData);

  if (!user) {
    throw new InternalServerError('signup', `Couldn't create new user with ${userData}`);
  }
  // console.log(user);
  return user.toJSON();
};

async function findUserByPk(user_id) {
  const userData = await User.findByPk(user_id);

  if (!userData) {
    throw new InternalServerError('login', `Couldn't find user with id ${user_id}`);
  }

  return userData.toJSON();
}

async function updateUser(user_id, userData) {
  const result = await User.update(userData, { where: { user_id }, individualHooks: true });

  if (!result[0]) {
    throw new InternalServerError(`Couldn't update user with ${userData}`);
  }

  return result;
}

module.exports = {
  userLogin,
  createUser,
  findUserByPk,
  updateUser,
  findUsers

}