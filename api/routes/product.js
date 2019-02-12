const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/articles')
    },
    filename: (res, file, cb) => {
        //cb(null, new Date().toISOString() + file.originalname)
        cb(null, res.body.name + '_' + file.originalname.split(' ').join('-'));
    }
});
const upload = multer({ storage: storage })
const productController = require('../controllers/products');

router.get('/'/*,checkAuth*/, productController.fetch);
router.get('/:id',/*checkAuth,*/ productController.find);
router.get('/:id/similar',/*checkAuth,*/ productController.findSimilar);
router.post('/:id/upload', /*checkAuth,*/ upload.single('fileToUpload'), productController.upload);
router.post('/create',checkAuth, productController.create);
router.delete('/:id',checkAuth, productController.delete);
router.patch('/:id/edit', checkAuth, productController.patch);

module.exports = router;
