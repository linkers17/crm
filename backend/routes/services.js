const {Router} = require('express');

const controller = require('../controllers/services');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const router = Router();

router.get('/', userAuth, controller.getServices);
router.get('/:id', userAuth, controller.getServiceById);
router.post('/', userAuth, checkRole(['director', 'admin']), controller.createService);
router.patch('/:id', userAuth, checkRole(['director', 'admin']), controller.updateService);
router.delete('/:id', userAuth, checkRole(['director', 'admin']), controller.removeService);

module.exports = router;