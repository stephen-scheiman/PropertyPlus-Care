const { BadRequestError } = require("../utils/errors");
const { findOpenTasks, createTask, findOpenTasksDueToday, findOpenTasksPastDue } = require("../utils/queries/tasks");
const { findOneIssue } = require("../utils/queries/issues");


async function renderOpenTasks(req, res) {
  const tasks = await findOpenTasks(req, res);
  // console.log('\n\ntaskcontroller\n\n');
  // console.log(tasks)
  res.status(200).render('task-aside', { tasks, layout: false });
}

async function renderOpenTasksDueDate(req, res) {
  const p1 = findOpenTasksPastDue();
  const p2 = findOpenTasksDueToday();
  const [pastTasks, todayTasks] = await Promise.all([p1, p2]);

  // console.log('\n\ntaskcontroller\n\n');
  // console.log(tasks)
  res.status(200).render('task-aside', { pastTasks, todayTasks, layout: false });
}

async function renderNewTaskForm(req, res) {
  // separating out issue_id and property_id values and assign to variables
  const { newTask } = req.query;
  const ids = newTask.split(" ");
  const issue_id = ids[0];
  const property_id = ids[1];

  // send issue_id and property_id values to form for later use
  res.status(200).render('task-form-new', { issue_id, property_id, layout: false });
}

// create task function
async function renderNewTask(req, res) {
  let { task_name, status_update, followUp_date, issue_id } = req.body;

  if (
    !(task_name && status_update && followUp_date && issue_id)
  ) {
    throw new BadRequestError(
      'task-new',
      "Missing Data - Please complete all fields");
  }

  followUp_date = new Date(followUp_date);

  if (isNaN(followUp_date)) {
    throw new BadRequestError(
      'task-new',
      "Please enter a valid date in the form of MM/DD/YY",
    );
  }

  if (task_name.length > 255) {
    throw new BadRequestError(
      'task-new',
      "Please limit the task name to 255 characters or less",
    );
  }

  const newTask = await createTask({ task_name, status_update, followUp_date, issue_id });

  const issue = await findOneIssue(issue_id);
  // const p2 = findTasksByIssueID(issue_id);
  // const [issue, tasks] = await Promise.all([p1, p2]);

  res.status(200).set('hx-trigger', 'update-tasks').render("issue-ID", { issue, layout: false });
}


module.exports = {
  renderOpenTasks,
  renderNewTaskForm,
  renderNewTask,
  renderOpenTasksDueDate,
};
