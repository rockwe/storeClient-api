const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const LignePanierController = require('../controllers/lignePaniers');

router.get('/',checkAuth, LignePanierController.fetch);
router.get('/:id',checkAuth, LignePanierController.find);
router.post('/create',checkAuth, LignePanierController.create);
router.delete('/:id',checkAuth, LignePanierController.delete);
router.patch('/:id', checkAuth, LignePanierController.patch);

module.exports = router;