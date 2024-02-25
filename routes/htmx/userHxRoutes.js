const router = require('express').Router();
const c = require('../../controller/userController');

router.route('/')
  .get(c.renderCurrentUser)
  .patch(c.renderEditedUser)

router.route('/edit')
  .get(c.renderUserEditForm)

module.exports = router; 