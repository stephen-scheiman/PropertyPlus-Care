const router = require('express').Router();
const c = require('../../controller/propertyController');

router.route('/')
  .get(c.renderProperties)


router.route('/:id')
  .get(c.renderOneProperty)

module.exports = router;