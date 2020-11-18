const {Router} = require('express');

const controller = require('../controllers/documents');
const userAuth = require('../middleware/userAuth');
const uploadDocument = require('../middleware/uploadDocument');
const router = Router();

router.get('/', userAuth, controller.getDocuments);
router.get('/:id', userAuth, controller.getDocumentById);
router.post('/', userAuth, uploadDocument.single('name'), controller.createDocument);
router.patch('/:id', userAuth, controller.updateDocument);
router.delete('/:id', userAuth, controller.removeDocument);

module.exports = router;