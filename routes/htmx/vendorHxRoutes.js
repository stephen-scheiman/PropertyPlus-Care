const router = require('express').Router();
const c = require('../../controller/vendorController');

router.route('/')
  .get(c.renderVendors)

router.route('/trades')
  .get(c.renderVendorsByTrade)

router.route('/new')
  .get(c.renderNewVendorForm)
  .post(c.renderNewVendorsList)

router.route('/:id')
  .get(c.renderOneVendor)

router.route('/:id/edit')
  .get(c.renderEditVendorForm)
  .post(c.renderUpdatedVendor)

router.route('/:id/issues')
  .post(c.renderVendorNewIssue)

module.exports = router;