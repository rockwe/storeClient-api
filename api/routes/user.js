const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/users')
    },

    filename: (res, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.split(' ').join('-'));
    }
});
const upload = multer({ storage: storage })

const userController = require('../controllers/users');

router.patch('/:id', userController.update);
router.get('/me', checkAuth, userController.me);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/push-token/set', checkAuth, userController.setDevicePushToken);
router.post('/logout', checkAuth, userController.logout);
router.patch('/:id/upload', checkAuth, upload.single('picture'), userController.upload);
router.get('/verifie-mail', userController.forgot_password);
router.patch('/:id/reset_password', userController.reset_password);


module.exports = router;
