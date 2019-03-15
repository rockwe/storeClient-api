const express = require('express');
const checkAuth = require('../middleware/chack-auth');
constrouter = express.Router();

const orderController = require('../controllers/orders');

//router.get('/',checkAuth, orderController.fetch);
router.get('/:id',checkAuth, orderController.find);
router.post('/create',checkAuth, orderController.create);
router.delete('/:id',checkAuth, orderController.delete);
router.patch('/:id', checkAuth, orderController.patch);

module.exports = router;