const router = require('express').Router();
const c = require('../../controller/api/vendorController');

/*  GET all vendors [done and tested]
    - vendor name, trade, email, phone
    GET one vendor [done and tested]
    - all fields
    - include issues
    Create new vendor
    - fist name, last name, trade, email, phone
    UPDATE vendor
    - any of the above fields
    DELETE vendor
    - make sure that somewhere there is a "are you sure you want to delete" check
*/
router.route('/')
.get(c.renderVendors)
.post(c.createVendor);

router.route('/:id')
.get(c.renderOneVendor)
.put(c.updateVendor)
.delete(c.deleteVendor);

module.exports = router;