const { Property } = require('../../models');
const c = require('../../controller/api/propertyController');

router.get('/', c.getAllProperties);
router.get('/ID', c.getPropertyByID);
router.post('/new', c.createProperty);
router.put('/update', c.updateProperty);
router.delete('/delete', c.deleteProperty);

module.exports = router;