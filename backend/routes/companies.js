const {Router} = require('express');
const controller = require('../controllers/companies');
const userAuth = require('../middleware/userAuth');

const router = Router();

router.get('/', userAuth, controller.getCompanies);
router.get('/:id', userAuth, controller.getCompanyById);
router.post('/', userAuth, controller.createCompany);
router.patch('/:id', userAuth, controller.updateCompany);
router.delete('/:id', userAuth, controller.removeCompany);

// Роуты для работы с сотрудником компании
router.patch('/:id/employee/add', userAuth, controller.addEmployee);
router.patch('/:id/employee/edit', userAuth, controller.editEmployee);
router.delete('/:id/employee/remove', userAuth, controller.removeEmployee);

module.exports = router;