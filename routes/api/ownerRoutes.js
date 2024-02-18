const router = require('express').Router();
const { getRounds } = require('bcrypt');
const c = require('../../controller/api/ownerController');


router.route('/')
  .get(c.renderOwners)
  .post(c.renderNewOwner);

router.route('/:id')
  .get(c.renderOwner)
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
