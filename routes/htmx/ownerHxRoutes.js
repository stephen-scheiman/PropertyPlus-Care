const router = require('express').Router();
const c = require('../../controller/ownerController');

router.route('/')
  .get(c.renderAllOwners);
//   .post(c.renderNewOwner);

// // enter additional routes above the /id route as needed
// router.route('/whichIssues')
//   .get(c.renderIssues);

// router.route('/:id')
//   .get(c.renderOneIssue)
//   .put(c.renderUpdatedIssue)
//   .delete(c.renderDeletedIssue);

// router.route('/:id/isDone')
//   .patch(c.renderIsIssueDone);

// router.route('/:issue_id/tasks/:task_id/isDone')
//   .patch(c.renderIsTaskDone);

// router.route('/property/:id')
//   .get(c.renderIssuesByProperty)
  
// module.exports = router;