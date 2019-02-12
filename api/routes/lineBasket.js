const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const lineBasketController = require('../controllers/lineBaskets');

router.get('/',checkAuth, lineBasketController.fetch);
router.get('/:id',checkAuth, lineBasketController.find);
router.post('/create',checkAuth, lineBasketController.create);
router.delete('/:id',checkAuth, lineBasketController.delete);
router.patch('/:id', checkAuth, lineBasketController.patch);

module.exports = router;