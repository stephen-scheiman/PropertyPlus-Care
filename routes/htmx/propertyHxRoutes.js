const router = require('express').Router();
const c = require('../../controller/propertyController');

router.route('/')
  .get(c.renderProperties)

router.route('/new')
  .get(c.renderNewPropertyForm)
  .post(c.renderNewPropertiesList);

router.route('/:id')
  .get(c.renderOneProperty)
  .patch(c.renderUpdatedProperty)
  .delete(c.renderDeletedProperty);

  router.route('/:id/edit')
  .get(c.renderEditPropertyForm)
  .patch(c.renderUpdatedProperty)

module.exports = router;