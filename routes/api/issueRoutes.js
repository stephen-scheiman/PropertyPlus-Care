const router = require('express').Router();
const c = require('../../controller/issueController');


router.route('/')
  .get(c.renderIssues)
  .post(c.renderNewIssue);

router.route('/:id')
  .get(c.renderOneIssue)
  .post(c.renderAddVendor)
  .patch(c.renderUpdatedIssue)
  .delete(c.renderDeletedIssue)


/* we need:
 GET all Issues
  - all Issue fields
  - include Property
 GET Issue by Id (or get one issue of some sort, probably by ID)
  - all fields
  - include:
    - related property
    - all tasks related to that issue
  CREATE New Issue
    - issue_title, issue_description, property_id
  UPDATE Issue
    - one or more of the Create Issue items (title, descr, prop_id)
  DELETE Issue
    - only to be used if user accidentally created it wrong or something (not MVP: add admin level permission)
    - make sure that somewhere there is a "are you sure you want to delete" check
*/

module.exports = router;