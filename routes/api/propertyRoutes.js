const router = require('express').Router();
const c = require('../../controller/propertyController');

router.route('/')
  .get(c.renderProperties)
  .post(c.createProperty);

router.route('/:id')
  .get(c.renderOneProperty)
  .put(c.updateProperty)
  .delete(c.deleteProperty);

module.exports = router;