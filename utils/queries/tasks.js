const { Property, Issue, Task } = require("../../models");
const { InternalServerError } = require("../errors");

async function getAllTasks() {
  const tasks = Task.findAll({
    include: [
      { model: Property, attributes: ["property_name"]},
      { model: Issue, attributes: ["issue_title"]},
    ],
    raw: true,
    nest: true,
  });

  if (!tasks) {
    throw new InternalServerError("Couldn't find tasks");
  }
  // console.log(tasks);
  return tasks;
}

async function getTaskByID(id) {
  const task = Task.findByPk(id, {
    include: [
      { model: Property, attributes: ["property_name"] },
      { model: Issue, attributes: ["issue_title"] },
    ],
    raw: true,
    nest: true,
  });

  if (!task) {
    throw new InternalServerError(`Couldn't find task with id ${id}`);
  }
  // console.log(task);
  return task;
}

async function getTasksByIssueID(issue_id) {
  const tasks = await Task.findAll({
    where: {issue_id: issue_id},
    raw: true,
    nest: true
  });

  if (!tasks) {
    throw new InternalServerError("Couldn't find tasks");
  };
  // console.log(tasks);
  return tasks;
}

async function createTask(taskData) {
  const task = await Task.create(taskData);

  if (!task) {
    throw new InternalServerError(`Couldn't create task with data ${taskData}`);
  }
  // console.log(task);
  return task;
}

async function updateTask(task_id, taskData) {
  const task = await Task.update(taskData, { where: { task_id } });

  if (!task[0]) {
    throw new InternalServerError("Update task failed");
  }
  // console.log(task);
  return task;
}

async function updateIsDone(task_id, is_done) {
  const task = await Task.update({is_done}, { where: { task_id }});

  if (!task) {
    throw new InternalServerError(`Couldn't update task isDone with data ${task_id}`);
  }
  console.log(task);
  return task;
}

async function deleteTask(task_id) {
  const task = await Task.destroy({ where: { task_id } });

  if (!task) {
    throw new InternalServerError(`Couldn't delete task with id ${task_id}`);
  }
  // console.log(task);
  return task;
};


module.exports = {
  getAllTasks,
  getTaskByID,
  getTasksByIssueID,
  createTask,
  updateTask,
  deleteTask,  
  updateIsDone
}