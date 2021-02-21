const {Router} = require('express');

const controller = require('../controllers/generate');
const userAuth = require('../middleware/userAuth');
const router = Router();

router.post('/agreement', userAuth, controller.generateAgreement);

module.exports = router;
