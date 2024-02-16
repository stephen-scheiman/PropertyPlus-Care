const router = require('express').Router();
const c = require('../controller/homeController.js');
const withAuth = require('../utils/auth.js');

router.get('/', withAuth, c.renderHome);
router.get('/login', c.userLogin);
router.get('/test', (req, res) => {res.render("homepage")});

module.exports = router;