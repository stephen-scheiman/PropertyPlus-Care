const router = require('express').Router();
const c = require('../../controller/api/vendorController');

/*  GET all vendors
    - vendor name, trade, email, phone
    GET one vendor
    - all fields
    - include issues
    Create new vendor
    - fist name, last name, trade, email, phone
    UPDATE vendor
    - any of the above fields
    DELETE vendor
    - make sure that somewhere there is a "are you sure you want to delete" check
*/


module.exports = router;