const router = require('express').Router();

const apiRoutes = require('./api');
const homeController = require('../controller/homeController.js');

router.use('/', homeController);
router.use('/api', apiRoutes);

module.exports = router;