const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderTasks)
  .get(c.renderOneTask);

module.exports = router;