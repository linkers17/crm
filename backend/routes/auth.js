const {Router} = require('express');
const controller = require('../controllers/auth');
const uploadImg = require('../middleware/uploadUserAvatar');
const userAuth = require('../middleware/userAuth');
const router = Router();

router.post('/login', controller.login);

router.post('/register', uploadImg.single('userImg'), controller.register);

router.post('/reset', controller.reset);

router.post('/reset/:token', controller.updatePassword);

router.get('/user', userAuth, controller.checkUser);

module.exports = router;
