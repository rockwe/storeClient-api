
const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const claimController = require('../controllers/claims');

router.get('/',checkAuth, claimController.fetch);
router.get('/:id',checkAuth, claimController.find);
router.post('/create',checkAuth, claimController.create);
router.delete('/:id',checkAuth, claimController.delete);
router.patch('/:id', checkAuth, claimController.patch);

module.exports = router;