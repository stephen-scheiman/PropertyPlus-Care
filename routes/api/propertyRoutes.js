const router = require('express').Router();
const c = require('../../controller/api/propertyController');

router.get('/', c.renderProperties);
router.get('/:id', c.renderOneProperty);
router.post('/new', c.createProperty);
router.put('/update', c.updateProperty);
router.delete('/delete', c.deleteProperty);

module.exports = router;