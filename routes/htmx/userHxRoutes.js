const router = require('express').Router();
const c = require('../../controller/userController');

router.route('/')
  .get(c.renderCurrentUser)
  .patch(c.renderUserEditForm)

router.route('/:id/edit')


module.exports = router;