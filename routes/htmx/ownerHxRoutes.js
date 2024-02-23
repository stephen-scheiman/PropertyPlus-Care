const router = require('express').Router();
const c = require('../../controller/ownerController');

router.route('/')
  .get(c.renderAllOwners)
  .post(c.renderNewOwner);


router.route('/:id')
  .get(c.renderOneOwner);
//   .put(c.renderUpdatedIssue)
//   .delete(c.renderDeletedIssue);

// router.route('/:id/isDone')
//   .patch(c.renderIsIssueDone);

// router.route('/:issue_id/tasks/:task_id/isDone')
//   .patch(c.renderIsTaskDone);

// router.route('/property/:id')
//   .get(c.renderIssuesByProperty)
  
module.exports = router;