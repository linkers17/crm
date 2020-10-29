const {Router} = require('express');
const controller = require('../controllers/contacts');
const userAuth = require('../middleware/userAuth');
const checkRole = require('../middleware/checkRole');
const router = Router();

router.get('/', userAuth, controller.getContacts);

router.post('/', userAuth, checkRole(['director', 'admin']), controller.addContact);

module.exports = router;
