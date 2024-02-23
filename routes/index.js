const router = require('express').Router();

// const apiRoutes = require('./api');
const hxRoutes = require('./htmx');
const testRoutes = require('./test/testRoutes');

router.use('/', hxRoutes);
// router.use('/api', apiRoutes);
// router.use('/test', testRoutes);

module.exports = router;