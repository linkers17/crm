const {Router} = require('express');
const controller = require('../controllers/users');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const uploadImg = require('../middleware/uploadUserAvatar');
const router = Router();

// Роуты для изменения роли пользователя => Доступ: директор, админ
// Пока временный
router.get('/:id/update_role_status', userAuth, checkRole(['director', 'admin']), controller.getUserByIdForRole);
router.patch('/:id/update_role_status/:role', userAuth, checkRole(['director', 'admin']), controller.updateUserByIdForRole);

// Получение и редактирование одного пользователя
router.get('/:id', userAuth, controller.getUserById);
router.patch('/:id', userAuth, uploadImg.single('userImg'), controller.updateUserById);

// Получение всех пользователей системы
router.get('/', userAuth, checkRole(['director', 'admin']), controller.getUsers);

module.exports = router;