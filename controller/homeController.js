const router = require('express').Router();
const { Issue,   } = require('../models');
const withAuth = require('../utils/auth');
const {} = require('../../utils.errors');

// NOTE: FILE IS INCOMPLETE

// render homepage with authentication
// homepage loads all current and past due Tasks
router.get('/home', withAuth, async (req, res) => {
  // Find the logged in user based on the session ID
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
    // do we need an include here?
    // include: [{ model: Task }],
  });

  const user = userData.get({ plain: true });

    res.render('homepage', {
      ...user,
      logged_in: true
    });
});

// insert more home routes here as needed ... 

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/home');
    return;
  }
  res.render('login');
});

module.exports = router;