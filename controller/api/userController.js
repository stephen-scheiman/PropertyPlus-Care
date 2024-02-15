const router = require('express').Router();
const { User } = require('../../models');

// Create new user
router.post('/', async (req, res) => {
  console.log(req.body.name)
  try {
    const dbUserData = await User.create({
      user_name: req.body.name,
      user_email: req.body.email,
      user_password: req.body.password,
    });

  

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = dbUserData.user_id;
      req.session.userName = dbUserData.user_name;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        user_email: req.body.email,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = dbUserData.user_id;
      req.session.userName = dbUserData.user_name;
      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;