const router = require('express').Router();
const c = require('../../controller/homeController.js');
const withAuth = require('../../utils/auth.js');

const propertiesRoutes = require('./propertyHxRoutes.js');

router.get('/', c.renderHome);
// router.get('/', withAuth, c.renderHome);
router.get('/login', c.userLogin);
router.use('/properties', propertiesRoutes);

module.exports = router;