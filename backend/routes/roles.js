const {Router} = require('express');
const controller = require('../controllers/roles');
const router = Router();

router.get('/', controller.getRoles);

//router.post('/', controller.addRole);

module.exports = router;
