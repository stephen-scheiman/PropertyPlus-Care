const router = require('express').Router();
const c = require('../../controller/issueController');

router.route('/')
  .get(c.renderOpenIssues)
  .post(c.renderNewIssue);

// enter additional routes above the /id route as needed
router.route('/whichIssues')
  .get(c.renderIssues);

router.route('/search')
  .post(c.renderIssuesSearch)

router.route('/:id')
  .get(c.renderOneIssue)
  .put(c.renderUpdatedIssue)
  .delete(c.renderDeletedIssue);

router.route('/:id/assign-vendor')
  .get(c.renderVendorsByTrade)
  .patch(c.renderAddVendor);

router.route('/:id/isDone')
  .patch(c.renderIsIssueDone);

router.route('/:issue_id/tasks/:task_id')
  .delete(c.renderDeletedTask);

router.route('/:issue_id/tasks/:task_id/isDone')
  .patch(c.renderIsTaskDone);

router.route('/property/:id')
  .get(c.renderIssuesByProperty)

module.exports = router;