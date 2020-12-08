const {Router} = require('express');

const controller = require('../controllers/notes');
const userAuth = require('../middleware/userAuth');
const router = Router();

router.get('/', userAuth, controller.getNotes);
router.get('/:id', userAuth, controller.getNoteById);
router.post('/:parentId', userAuth, controller.createNote);
router.patch('/:id', userAuth, controller.updateNote);
router.delete('/:id', userAuth, controller.removeNote);

module.exports = router;