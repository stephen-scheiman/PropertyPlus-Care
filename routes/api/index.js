const router = require('express').Router();
const userController = require('../../controller/api/userController.js');
const propertyRoutes = require('./propertyRoutes.js');
const issueController = require('../../controller/api/issueController.js');
const ownerController = require('../../controller/api/ownerController.js');
const vendorController = require('../../controller/api/vendorController.js');
const taskController = require('../../controller/api/taskController.js');

// these are the api end points I see using
// router.use('/users',);
router.use('/properties', propertyRoutes);
// router.use('/issues', issueController);
// router.use('/owners', ownerController);
// router.use('/vendors', vendorController);
// router.use('/tasks', taskController);

module.exports = router;
