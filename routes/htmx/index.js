const router = require('express').Router();
const c = require('../../controller/homeController.js');
const withAuth = require('../../utils/auth.js');

const loginHxRoutes = require("./loginHxRoutes.js");
const propertyHxRoutes = require('./propertyHxRoutes.js');
const issueHxRoutes = require('./issueHxRoutes.js');
const taskHxRoutes = require('./taskHxRoutes.js');

router.get('/', c.renderHome);
// router.get('/', withAuth, c.renderHome);
router.use('/login', loginHxRoutes);
router.use('/properties', propertyHxRoutes);
router.use('/issues', issueHxRoutes);
router.use('/tasks', taskHxRoutes);

module.exports = router;