const {Router} = require('express');

const controller = require('../controllers/documents');
const userAuth = require('../middleware/userAuth');
const uploadDocument = require('../middleware/uploadDocument');
const router = Router();

router.get('/', userAuth, controller.getDocuments);
router.get('/:id', userAuth, controller.getDocumentById);
router.post('/', userAuth, uploadDocument.single('filePath'), controller.createDocument);
router.patch('/:id', userAuth, uploadDocument.single('filePath'), controller.updateDocument);
router.delete('/:id', userAuth, controller.removeDocument);

module.exports = router;