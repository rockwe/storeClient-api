const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const markController = require('../controllers/marks');

router.get('/',checkAuth, markController.fetch);
router.get('/:id',checkAuth, markController.find);
router.post('/create'/*,checkAuth*/, markController.create);
router.delete('/:id',checkAuth, markController.delete);
router.patch('/:id', checkAuth, markController.patch);

module.exports = router;