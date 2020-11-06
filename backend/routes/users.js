const {Router} = require('express');
const controller = require('../controllers/users');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const router = Router();

// Роуты для изменения роли пользователя => Доступ: директор, админ
// Пока временный
router.get('/:id/update_role_status', userAuth, checkRole(['director', 'admin']), controller.getUserById);
router.patch('/:id/update_role_status/:role', userAuth, checkRole(['director', 'admin']), controller.updateUserById);

// Получение всех пользователей системы
router.get('/', userAuth, checkRole(['director', 'admin']), controller.getUsers);

module.exports = router;