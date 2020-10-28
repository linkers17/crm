const {Router} = require('express');
const passport = require('passport');
const controller = require('../controllers/contacts');
const router = Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getContacts);

router.post('/', controller.addContact);

module.exports = router;
