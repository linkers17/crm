const {Router} = require('express');
const controller = require('../controllers/tasks');
const userAuth = require('../middleware/userAuth');

const router = Router();

router.get('/', userAuth, controller.getTasks);
router.get('/:id', userAuth, controller.getTaskById);
router.post('/', userAuth, controller.createTask);
router.patch('/:id', userAuth, controller.updateTask);
router.delete('/:id', userAuth, controller.removeTask);

module.exports = router;