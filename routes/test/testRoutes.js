const router = require('express').Router();
const {User, Task, Property} = require('../../models');
const {Op} = require('sequelize');

router.route('/')
  .get((req, res) => {res.render("homepage")})

router.route("/pg1")
  .get(renderPg1)

router.route("/pg2")
  .get((req, res) => {res.render("test2", {layout:false})})

router.route("/pg3")
  .get((req, res) => {res.render("test3", {layout:false})})

router.route("/pg4")
  .get((req, res) => {res.render("test4", {layout:false})})

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
  
  // homepage loads all current and past due Tasks
  async function renderPg1(req, res) {
    // const { user_id, logged_in } = req.session;
  
    // calling two promises but not awaiting them individually
    // 3rd line of code awaits both promises before continuing.
    // Only works when the two promises are independent of each other.
    const p1 = getUser(1);
    const p2 = findTasks();
    const [userData, taskData] = await Promise.all([p1,p2]);
  
    console.log(userData);
    console.log(taskData);
    // this needs to be completed when we know what the homepage will look like
    res.status(200).render("test1",{ taskData, userData,layout:false});
  
    // res.status(200).render('homepage', {
    //   logged_in, taskData, userData
    // });
  }




module.exports = router;