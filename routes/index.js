const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const testRoutes = require('./test/testRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/test', testRoutes);

module.exports = router;