const router = require('express').Router();
const {User, Task, Property} = require('../../models');
const { Op } = require('sequelize');

// header logging
router.use((req, res, next) => {
  console.log('\n\njson: ', req.headers['content-type'], '\nhtmx: ', req.headers['hx-request'], '\n\n');
  console.log(req.body, '\n\n');
  next();
})


router.route('/')
  .get(withAuth, (req, res) => { res.redirect('/test/pg1') })

router.route("/pg1")
  .get(withAuth, renderPg1)

router.route("/pg2")
  .get(withAuth, (req, res) => {res.render("test2")})

router.route("/pg3")
  .get(withAuth, (req, res) => {res.render("test3")})

router.route("/pg4")
  .get(withAuth, (req, res) => {res.render("test4")})

router.route('/login')
  .get((req, res) => {res.render('testLogin')})
  .post(userLogin)

router.route('/logout')
  .post(userLogout)


async function renderPg1(req, res) {
  // const { user_id, logged_in } = req.session;

  const p1 = getUser(1);
  const p2 = findTasks();
  const [userData, taskData] = await Promise.all([p1,p2]);

  if (req.headers['hx-request']) {
    res.status(200).render("test1", { taskData, userData, layout: false });
  } else if (req.headers['content-type'] === 'application/json') {
    res.status(200).json({ msg: 'Success', userData, taskData });
  } else {
    res.status(200).render("test1", { taskData, userData });
  }
}

async function userLogin(req, res) {
  const { user_email, user_password } = req.body;

  const userData = await User.findOne({ where: {user_email}});

  if (!userData) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  const validPassword = await userData.checkPassword(user_password);

  if (!validPassword) {
    throw new BadRequestError("Incorrect email or password, please try again or register a new account");
  }

  req.session.save(() => {
    req.session.user_id = userData.user_id;
    req.session.logged_in = true;

    console.log('found and logged in');

    if (req.headers['hx-request']) {
      res.status(200).set('HX-Redirect', '/test/pg1').end()
    } else if (req.headers['content-type'] === 'application/json') {
      res.status(200).json({ msg: 'Success', userData })
    } else {
      res.status(200).redirect('/test/pg1');
    }
  })
};

async function userLogout(req, res) {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      if (req.headers['hx-request']) {
        res.status(200).set('hx-Redirect', '/test/login').end();
      } else if (req.headers['content-type'] === 'application/json') {
        res.status(200).json({ msg: 'Logout' })
      } else {
        res.status(200).redirect('/test/login');
      }
    });
  } else {
    throw new BadRequestError("You are not logged in.");
  }
};

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

async function getUser(id) {
  return (await User.findByPk(id)).toJSON();
};

function withAuth(req, res, next) {
  if (!req.session.logged_in) {
    res.redirect('/test/login');
  } else {
    next();
  }
};

module.exports = router;