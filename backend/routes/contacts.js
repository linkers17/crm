const {Router} = require('express');
const controller = require('../controllers/contacts');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const uploadImgContact = require('../middleware/uploadImgContact');
const router = Router();

router.get('/', controller.getContacts);

router.get('/:id', controller.getContactById);

router.post('/', userAuth, checkRole(['director', 'admin']), uploadImgContact.single('img'), controller.createContact);

router.patch('/:id', userAuth, checkRole(['director', 'admin']), uploadImgContact.single('img'), controller.updateContact);

router.delete('/:id', userAuth, checkRole(['director', 'admin']), controller.removeContact);

module.exports = router;
