const {Router} = require('express');

const controller = require('../controllers/orders');
const userAuth = require('../middleware/userAuth');
const router = Router();

router.get('/', userAuth, controller.getOrders);
router.get('/:id', userAuth, controller.getOrderById);
router.post('/', userAuth, controller.createOrder);
router.patch('/:id', userAuth, controller.updateOrder);
router.delete('/:id', userAuth, controller.removeOrder);

module.exports = router;