const router = require('express').Router();
const c = require('../../controller/homeController.js');
const withAuth = require('../../utils/auth.js');
const pageRedirect = require('../../utils/redirect.js');

const loginHxRoutes = require("./loginHxRoutes.js");
const propertyHxRoutes = require('./propertyHxRoutes.js');
const issueHxRoutes = require('./issueHxRoutes.js');
const taskHxRoutes = require('./taskHxRoutes.js');
const vendorHxRoutes = require('./vendorHxRoutes.js');
const ownerHxRoutes = require('./ownerHxRoutes.js');
const signupHxRoutes = require('./signupHxRoutes.js');
const userHxRoutes = require('./userHxRoutes.js');


router.use('/login', loginHxRoutes);
router.use('/signup', signupHxRoutes);

router.use(withAuth);

router.get('/', c.renderHome);
router.get('/favicon.ico', (req, res) => { res.status(200).end() });

router.use(pageRedirect);


router.get('/aside', c.renderAside)
// router.get('/', withAuth, c.renderHome);
router.use('/login', loginHxRoutes);
router.use('/properties', propertyHxRoutes);
router.use('/issues', issueHxRoutes);
router.use('/tasks', taskHxRoutes);
router.use('/vendors', vendorHxRoutes);
router.use('/owners', ownerHxRoutes);
router.use('/users', userHxRoutes);

module.exports = router;