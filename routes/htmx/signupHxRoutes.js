const router = require('express').Router();
const c = require('../../controller/userController');

router.route('/')
  .get(c.renderSignupForm)
  .post(c.renderNewUser)

module.exports = router;