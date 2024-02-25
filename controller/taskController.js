const { BadRequestError } = require("../utils/errors");
const { findOpenTasks, createTask, findTasksByIssueID } = require("../utils/queries/tasks");
const { findOneIssue } = require("../utils/queries/issues");

// I DON"T THINK WE NEED THIS
// async function renderAllTasks(req, res) {
//   const tasks = await findAllTasks();
//   res.status(200).render('task-main', { tasks, layout: false });
// }

async function renderOpenTasks(req, res) {
  const tasks = await findOpenTasks(req, res);
  res.status(200).render('task-aside', { tasks, layout: false });
}

// WE MAY NOT NEED THIS RENDER ONE TASK
// async function renderOneTask(req, res) {
//   const { id: task_id } = req.params;
//   const task = await findTaskByID(task_id);
//   res.status(200).render(("issue-ID", { task }));
// }

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
  let { task_name, status_update, followUp_date, property_id, issue_id } =
    req.body;

  if (
    !(task_name && status_update && followUp_date && property_id && issue_id)
  ) {
    throw new BadRequestError("Missing Data - Please complete all fields");
  }

  followUp_date = new Date(followUp_date);

  if (isNaN(followUp_date)) {
    throw new BadRequestError(
      "Please enter a valid date in the form of MM/DD/YY",
    );
  }

  if (task_name.length > 255) {
    throw new BadRequestError(
      "Please limit the task name to 255 characters or less",
    );
  }

  const newTask = await createTask({ task_name, status_update, followUp_date, property_id, issue_id });

  const p1 = findOneIssue(issue_id);
  const p2 = findTasksByIssueID(issue_id);
  const [issue, tasks] = await Promise.all([p1, p2]);

  res.status(200).set('HX-Trigger', 'update-aside').render("issue-ID", { issue, tasks, layout: false });
}

//update task function
// async function updateTask(req, res) {
//   const task_id = req.params.id;
//   let { task_name, status_update, followUp_date, is_done } = req.body;

//   followUp_date = new Date(followUp_date);

//   if (isNaN(followUp_date)) {
//     throw new BadRequestError("Please enter a valid date in the form MM/DD/YY");
//   }

//   if (task_name.length > 255) {
//     throw new BadRequestError(
//       "Please limit the task name to 255 characters or less",
//     );
//   }

//   const taskData = await Task.update(
//     {
//       task_name,
//       status_update,
//       followUp_date,
//       is_done,
//     },
//     {
//       where: {
//         task_id,
//       },
//     },
//   );

//   if (!taskData[0]) {
//     throw new BadRequestError("Update task failed");
//   } else {
//     res.status(200).json({ msg: `Update task ID: ${task_id} succeeded` });
//   }
// }

module.exports = {
  // renderAllTasks,
  renderOpenTasks,
  // renderOneTask,
  renderNewTaskForm,
  renderNewTask,
  // updateTask,
};
