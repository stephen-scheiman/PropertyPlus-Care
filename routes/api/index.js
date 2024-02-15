const router = require('express').Router();
const userRoutes = require('../../controller/api/userController');

router.use('/users', userRoutes);

module.exports = router;
