const router = require('express').Router();
const c = require('../../controller/ownerController');


router.route('/')
  .get(c.renderAllOwners)
  .post(c.renderNewOwner);

router.route('/:id')
  .get(c.renderOneOwner)
  .patch(c.renderUpdateOwner)
  .delete(c.renderDeleteOwner)


/* we need:
GET all Owners
  - all Owner fields
GET Owner by Id (or get one of some sort, probably by ID)
  - all fields
  - include:
    - related properties
CREATE New Owner
  - owner_name, owner_email, owner_phone, owner_street, owner_city, state, zip, property_id
UPDATE Owner
  - can edit any of the "new owner" fields
DELETE Owner
  - make sure that somewhere there is a "are you sure you want to delete" check
*/

module.exports = router;
