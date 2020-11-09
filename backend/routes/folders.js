const {Router} = require('express');

const controller = require('../controllers/folders');
const userAuth = require('../middleware/userAuth');
const router = Router();

router.get('/', userAuth, controller.getFolders);
router.get('/:id', userAuth, controller.getFolderById);
router.post('/', userAuth, controller.createFolder);
router.patch('/:id', userAuth, controller.updateFolder);
router.delete('/:id', userAuth, controller.removeFolder);

module.exports = router;