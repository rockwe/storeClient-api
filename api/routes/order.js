const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const orderController = require('../controllers/orders');

router.get('/',checkAuth, orderController.fetch);
router.get('/:id',/*checkAuth,*/ orderController.find);
router.get('/userOder/:user',/*checkAuth,*/ orderController.findUser);
router.post('/create',checkAuth, orderController.create);
router.delete('/:id',checkAuth, orderController.delete);
router.patch('/:id', checkAuth, orderController.patch);

module.exports = router;