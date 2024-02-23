const { Task } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");
const { findOpenTasks, findTaskByID } = require("../utils/queries/tasks");

// I DON"T THINK WE NEED THIS
// async function renderAllTasks(req, res) {
//   const tasks = await findAllTasks();
//   res.status(200).render('task-main', { tasks, layout: false });
// }

async function renderOpenTasks(req, res) {
  const tasks = await findOpenTasks(req, res);
  res.status(200).render('task-main', { tasks, layout: false });
}

// WE MAY NOT NEED THIS RENDER ONE TASK
// async function renderOneTask(req, res) {
//   const { id: task_id } = req.params;
//   const task = await findTaskByID(task_id);
//   res.status(200).render(("issue-ID", { task }));
// }

// create task function
async function createTask(req, res) {
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

  const newTask = await Task.create({
    task_name,
    status_update,
    followUp_date,
    property_id,
    issue_id,
  });

  if (!newTask) {
    throw new InternalServerError("New Task creation failed.");
  } else {
    res.status(200).json({ msg: "New Task succesfully created!" });
  }
}

//update task function
async function updateTask(req, res) {
  const task_id = req.params.id;
  let { task_name, status_update, followUp_date, is_done } = req.body;

  followUp_date = new Date(followUp_date);

  if (isNaN(followUp_date)) {
    throw new BadRequestError("Please enter a valid date in the form MM/DD/YY");
  }

  if (task_name.length > 255) {
    throw new BadRequestError(
      "Please limit the task name to 255 characters or less",
    );
  }

  const taskData = await Task.update(
    {
      task_name,
      status_update,
      followUp_date,
      is_done,
    },
    {
      where: {
        task_id,
      },
    },
  );

  if (!taskData[0]) {
    throw new BadRequestError("Update task failed");
  } else {
    res.status(200).json({ msg: `Update task ID: ${task_id} succeeded` });
  }
}

module.exports = {
  // renderAllTasks,
  renderOpenTasks,
  // renderOneTask,
  createTask,
  updateTask,
};
