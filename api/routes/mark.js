const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const markeController = require('../controllers/marks');

router.get('/',checkAuth, markeController.fetch);
router.get('/:id',checkAuth, markeController.find);
router.post('/create'/*,checkAuth*/, markeController.create);
router.delete('/:id',checkAuth, markeController.delete);
router.patch('/:id', checkAuth, markeController.patch);

module.exports = router;