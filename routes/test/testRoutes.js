const router = require('express').Router();
const {User, Task, Property} = require('../../models');
const { Op } = require('sequelize');

// header logging
router.use((req, res, next) => {
  console.log('\n\njson: ', req.headers['content-type'], '\nhtmx: ', req.headers['hx-request'], '\n\n');
  next();
})


router.route('/')
  .get((req, res) => {res.render("homepage")})

router.route("/pg1")
  .get(renderPg1)

router.route("/pg2")
  .get((req, res) => {res.render("test2")})

router.route("/pg3")
  .get((req, res) => {res.render("test3")})

router.route("/pg4")
  .get((req, res) => {res.render("test4")})



async function renderPg1(req, res) {
  // const { user_id, logged_in } = req.session;

  const p1 = getUser(1);
  const p2 = findTasks();
  const [userData, taskData] = await Promise.all([p1,p2]);


  if (req.headers['content-type'] === 'application/json') {
    res.status(200).json({ msg: 'Success', userData, taskData });
  } else if (req.headers['hx-request']) {
    res.status(200).render("test1", { taskData, userData, layout: false });
  } else {
    res.status(200).render("test1", { taskData, userData });
  }

}

async function findTasks() {
  const taskData = await Task.findAll({
    where: {
      followUp_date: {
        [Op.lte]: Date.now()
      }
    },
    include: [{
      model: Property,
      attributes: ['property_id', 'property_name']
    }],
    // returning raw data - will test if this works
    raw: true,
    // telling it that the data returned will be nest
    nest: true,
  });
  return taskData;
};

/**
 *
 * @param {number} id user ID
 * @returns User model object
 */
async function getUser(id) {
  return (await User.findByPk(id)).toJSON();
};


module.exports = router;