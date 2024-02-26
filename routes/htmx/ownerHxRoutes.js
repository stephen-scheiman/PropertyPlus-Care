const router = require('express').Router();
const c = require('../../controller/ownerController');

router.route('/')
  .get(c.renderOwners)

router.route('/search')
  .post(c.renderOwnerSearch)

router.route('/new')
  .get(c.renderNewOwnerForm)
  .post(c.renderNewOwnersList);

router.route('/:id')
  .get(c.renderOneOwner)
  .patch(c.renderUpdatedOwner)
  .delete(c.renderDeletedOwner);

  router.route('/:id/edit')
  .get(c.renderEditOwnerForm)
  .patch(c.renderUpdatedOwner)

module.exports = router;