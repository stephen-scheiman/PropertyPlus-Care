const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderOpenTasks)
  // .get(c.renderOneTask)
  // .post(c.renderNewTask);

router.route('/new')
  .get(c.renderNewTaskForm)
  .post(c.renderNewTask)

module.exports = router;