const { Task } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");
const {
  getAllTasks,
  getTaskByID, 
  updateIsDone } = require("../utils/queries/tasks");

async function renderTasks(req, res) {
  const tasks = await getAllTasks();
  res.status(200).json({ tasks });
}

async function renderOneTask(req, res) {
  const { id: task_id } = req.params;
  const task = await getTaskByID(task_id);
  res.status(200).json({ task });
}

async function renderIsDone(req, res) {
  let task;
  const { id } = req.params;
  const { isDone } = req.body;
  if (isDone === "Re-Open") {
    task = await updateIsDone(id, false);
  } else {
    task = await updateIsDone(id, true);
  };

  res.status(200).render("issue-ID", { task });
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

  const datePattern =
    /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g;
  if (!datePattern.test(followUp_date)) {
    throw new BadRequestError("Please enter the follow up date as 'MM/DD/YYY'");
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

  const datePattern =
    /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g;
  if (!datePattern.test(followUp_date)) {
    throw new BadRequestError("Please enter the follow up date as 'MM/DD/YY'");
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

module.exports = { renderTasks, renderOneTask, createTask, updateTask, renderIsDone };
