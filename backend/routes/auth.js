const {Router} = require('express');
const controller = require('../controllers/auth');
const uploadImg = require('../middleware/uploadUserAvatar');
const router = Router();

router.post('/login', controller.login);

router.post('/register', uploadImg.single('userImg'), controller.register);

module.exports = router;
