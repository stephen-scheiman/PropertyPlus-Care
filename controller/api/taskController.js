const { Property, Issue, Task } = require('../../models');
const { BadRequestError, InternalServerError } = require('../../utils/errors');

/* for purposes of unit testing, separating sequelize request function
from render data functions */
// sequelize get all task and related table data
async function getAllTasks() {
    const taskData = Task.findAll({
      include: [{
        model: Property,
        attributes: ["property_name"],
        model: Issue,
        attributes: ["issue_title"],
      }],
      raw: true,
      nest: true
    });
  
    if (!taskData) {
      throw new BadRequestError('Something went wrong');
    }
  
    return taskData;
  };

// render task data function
async function renderTasks(req, res) {
    const tasks = await getAllTasks();  
    res.status(200).json({ tasks });
  };









// module.exports = // { function names } ;