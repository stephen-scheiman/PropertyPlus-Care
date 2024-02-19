const router = require('express').Router();
const c = require('../../controller/taskController');

/* What we need:
  GET all Tasks [done]
  - all fields
  - include property_name, issue_title
  GET one Task (probs by id) [done]
  - all fields
  - include property_name, issue_title
  CREATE New Task [done]
  - task_name, status_update, followUp_date, property_id, issue_id
  UPDATE Task [done]
  - edit any of the above new Task fields
  DELETE Task by ID [future release]
  - only to be used if user accidentally created it wrong or something (not MVP: add admin level permission)
  - make sure that somewhere there is a "are you sure you want to delete" check*/
  router.route('/')
    .get(c.renderTasks)
    .post(c.createTask);

  router.route('/:id')
    .get(c.renderOneTask)
    .put(c.updateTask)

module.exports = router;