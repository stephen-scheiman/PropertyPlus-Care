const router = require('express').Router();
const c = require('../../controller/taskController');

router.route('/')
  .get(c.renderTasks)
  .get(c.renderOneTask);

router.route('/:id/isDone')
  .patch(c.renderIsDone);