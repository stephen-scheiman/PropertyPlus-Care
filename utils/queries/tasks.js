const e = require("express");
const { Property, Issue, Task } = require("../../models");
const { InternalServerError } = require("../errors");
const { Op } = require('sequelize');

async function findOpenTasks() {
  const tasks = await Task.findAll({
    where: { is_done: false },
    include: [
      { model: Property, attributes: ["property_name"] },
      { model: Issue, attributes: ["issue_title"] },
    ],
  });

  if (!tasks) {
    throw new InternalServerError("Couldn't find tasks");
  }
  // console.log(tasks);
  return tasks.map((e) => e.toJSON());
}

async function findTasksByIssueID(issue_id) {
  const tasks = await Task.findAll({
    where: { issue_id: issue_id },
    raw: true,
    nest: true
  });

  if (!tasks) {
    throw new InternalServerError("Couldn't find tasks");
  };
  // console.log(tasks);
  return tasks;
}

async function findOpenTasksByDueDate() {
  const taskData = await Task.findAll({
    where: {
      [Op.and]: [
        { followUp_date: { [Op.lte]: Date.now() } },
        { is_done: false }
      ]
    },
    include: [
      { model: Property, attributes: ["property_name"] },
      { model: Issue, attributes: ["issue_title"] },
    ],
  });

  const tasks = taskData.map(e => e.toJSON());
  return tasks;
}

async function createTask(taskData) {
  const task = await Task.create(taskData);

  if (!task) {
    throw new InternalServerError(`New Task creation failed. ${taskData}`);
  }
  // console.log(task);
  return task;
}

async function updateIsDone(task_id, is_done) {
  const task = await Task.update({ is_done }, { where: { task_id } });

  if (!task) {
    throw new InternalServerError(`Couldn't update task isDone with data ${task_id}`);
  }
  // console.log(task);
  return task;
}

async function deleteTask(task_id) {
  // console.log(task_id);
  const task = await Task.destroy({ where: { task_id } });

  if (!task) {
    throw new InternalServerError(`Couldn't delete task with id ${task_id}`);
  }
  // console.log(task);
  return task;
};

// NOT SURE WE NEED THIS
// async function findAllTasks() {
//   const tasks = await Task.findAll({
//     include: [
//       { model: Property, attributes: ["property_name"] },
//       { model: Issue, attributes: ["issue_title"] },
//     ],
//   });
//   if (!tasks) {
//     throw new InternalServerError("Couldn't find tasks");
//   }
//   console.log(tasks);
//   return tasks.map((e) => e.toJSON());
// }

// async function findTaskByID(id) {
//   const task = Task.findByPk(id, {
//     include: [
//       { model: Property, attributes: ["property_name"] },
//       { model: Issue, attributes: ["issue_title"] },
//     ],
//     raw: true,
//     nest: true,
//   });
//   if (!task) {
//     throw new InternalServerError(`Couldn't find task with id ${id}`);
//   }
//   // console.log(task);
//   return task;
// }

// async function updateTask(task_id, taskData) {
//   const task = await Task.update(taskData, { where: { task_id } });
//   if (!task[0]) {
//     throw new InternalServerError("Update task failed");
//   }
//   // console.log(task);
//   return task;
// }

module.exports = {
  // findAllTasks,
  findOpenTasks,
  // findTaskByID,
  findTasksByIssueID,
  createTask,
  // updateTask,
  deleteTask,
  updateIsDone,
  findOpenTasksByDueDate,
}