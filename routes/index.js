const router = require('express').Router();

// const apiRoutes = require('./api');
const hxRoutes = require('./htmx');

router.use('/', hxRoutes);
// router.use('/api', apiRoutes);

module.exports = router;