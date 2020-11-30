const {Router} = require('express');
const controller = require('../controllers/customers');
const userAuth = require('../middleware/userAuth');

const router = Router();

router.get('/', userAuth, controller.getCustomers);
router.get('/:id', userAuth, controller.getCustomerById);
router.post('/', userAuth, controller.createCustomer);
router.patch('/:id', userAuth, controller.updateCustomer);
router.delete('/:id', userAuth, controller.removeCustomer);

module.exports = router;