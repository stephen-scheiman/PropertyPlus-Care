const { User } = require('../../models');
const c = require('../../controller/api/userController');

router.post('/', c.createUser);
router.post('/login', c.userLogin);
router.post('/logout', c.userLogout);

module.exports = router;