const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderAllTasks)
  .get(c.renderOneTask);

module.exports = router;