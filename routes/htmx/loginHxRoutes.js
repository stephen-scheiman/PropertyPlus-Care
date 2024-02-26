const router = require("express").Router();
const c = require("../../controller/userController");

router.route("/")
  .get(c.renderLoginForm)
  .post(c.renderLoggedInHome)

module.exports = router;