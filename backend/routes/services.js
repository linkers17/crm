const {Router} = require('express');

const controller = require('../controllers/services');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const router = Router();

router.get('/', userAuth, controller.getServices);
router.get('/:id', userAuth, controller.getServiceById);
router.post('/', checkRole(['director', 'admin']), userAuth, controller.createService);
router.patch('/:id', checkRole(['director', 'admin']), userAuth, controller.updateService);
router.delete('/:id', checkRole(['director', 'admin']), userAuth, controller.removeService);

module.exports = router;