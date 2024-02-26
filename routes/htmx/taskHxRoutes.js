const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderOpenTasks);

router.route('/due')
  .get(c.renderOpenTasksDueDate)

router.route('/new')
  .get(c.renderNewTaskForm)
  .post(c.renderNewTask);

module.exports = router;