const {Router} = require('express');
const controller = require('../controllers/contacts');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const router = Router();

router.get('/', controller.getContacts);

router.get('/:id', controller.getContactById);

router.post('/', userAuth, checkRole(['director', 'admin']), controller.createContact);

router.patch('/:id', userAuth, checkRole(['director', 'admin']), controller.updateContact);

router.delete('/:id', userAuth, checkRole(['director', 'admin']), controller.removeContact);

module.exports = router;
