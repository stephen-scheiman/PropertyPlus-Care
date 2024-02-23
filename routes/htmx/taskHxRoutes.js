const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderOpenTasks);
  // .get(c.renderOneTask);

module.exports = router;