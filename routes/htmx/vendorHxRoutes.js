const router = require('express').Router();
const c = require('../../controller/vendorController');

router.route('/')
  .get(c.renderVendors)

router.route('/issues')
  .get(c.renderIssuesSelect)

router.route('/:id')
  .get(c.renderOneVendor)

router.route('/:id/issues')
  .post(c.renderVendorNewIssue)

module.exports = router;