const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const billController = require('../controllers/bills');

router.get('/',checkAuth, billController.fetch);
router.get('/:id',checkAuth, billController.find);
router.post('/create',checkAuth, billController.create);
router.delete('/:id',checkAuth, billController.delete);
router.patch('/:id', checkAuth, billController.patch);

module.exports = router;