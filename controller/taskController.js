const { Property, Issue, Task } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");

/* for purposes of unit testing, separating sequelize request function
from render data functions */

// sequelize get all task and related table data
async function getAllTasks() {
  const taskData = Task.findAll({
    include: [
      { model: Property, attributes: ["property_name"]},
      { model: Issue, attributes: ["issue_title"]},
    ],
    raw: true,
    nest: true,
  });

  if (!taskData) {
    throw new BadRequestError("Something went wrong");
  }

  return taskData;
}

// render task data function
async function renderTasks(req, res) {
  const tasks = await getAllTasks();
  res.status(200).json({ tasks });
}

// sequelize get a task and related table data by ID
async function getTaskByID(id) {
  const taskData = Task.findByPk(id, {
    include: [
      { model: Property, attributes: ["property_name"] },
      { model: Issue, attributes: ["issue_title"] },
    ],
    raw: true,
    nest: true,
  });

  if (!taskData) {
    throw new BadRequestError("Something went wrong");
  }

  return taskData;
}

// render one task function
async function renderOneTask(req, res) {
  const { id: task_id } = req.params;
  const task = await getTaskByID(task_id);
  res.status(200).json({ task });
}

// create task function
async function createTask(req, res) {
  const { task_name, status_update, followUp_date, property_id, issue_id } =
    req.body;

  if (
    !(task_name && status_update && followUp_date && property_id && issue_id)
  ) {
    throw new BadRequestError("Missing Data - Please complete all fields");
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
  const { task_name, status_update, followUp_date, is_done } = req.body;

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

module.exports = { renderTasks, renderOneTask, createTask, updateTask };
