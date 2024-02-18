const router = require('express').Router();
const userRoutes = require('./userRoutes.js');
const propertyRoutes = require('./propertyRoutes.js');
const issueRoutes = require('./issueRoutes.js');
const ownerRoutes = require('./ownerRoutes.js');
const vendorRoutes = require('./vendorRoutes.js');
const taskRoutes = require('./taskRoutes.js');

// these are the api end points I see using
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/issues', issueRoutes);
router.use('/owners', ownerRoutes);
router.use('/vendors', vendorRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;