const router = require('express').Router();
const c = require('../../controller/ownerController');

router.route('/')
  .get(c.renderAllOwners)
  .post(c.renderNewOwner);

router.route('/:id')
  .get(c.renderOneOwner)
  .patch(c.renderUpdateOwner)
  .delete(c.renderDeleteOwner);
  
module.exports = router;