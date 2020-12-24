const Companies = require('../models/Companies');
const Notes = require('../models/Notes');
const Tasks  =require('../models/Tasks');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getCompanies = async (req, res) => {

    try {

        const query = {};

        if (req.query.title) {
            query.title = req.query.title;
        }
        
        if (req.query.email) {
            query.emails = {$in: [req.query.email]};
        }

        if (req.query.assignedUserId) {
            query.assignedUserId = mongoose.Types.ObjectId(req.query.assignedUserId);
        }

        const companies = await Companies.aggregate([
            {$match: query},
            {$lookup: {
                from: 'users',
                localField: 'assignedUserId',
                foreignField: '_id',
                as: 'assignedUserLogin'
            }},
            {$project: {
                '_id': 1,
                title: 1,
                site: 1,
                assignedUserId: 1,
                'assignedUserLogin.login': 1
            }}
        ]);

        const companiesCount = await Companies.countDocuments(query);

        res.status(200).json({companies, companiesCount});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getCompanyById = async (req, res) => {

    try {

        const candidate = await Companies.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({errors: 'Компания не найдена, возможно она была удалена.'});
        } else {

            const company = await Companies.aggregate([
                {$match: {
                    '_id': mongoose.Types.ObjectId(req.params.id)
                }},
                {$lookup: {
                    from: 'documents',
                    localField: 'documentIds',
                    foreignField: '_id',
                    as: 'documents'
                }},
                {$lookup: {
                    from: 'users',
                    localField: 'assignedUserId',
                    foreignField: '_id',
                    as: 'assignedUserLogin'
                }},
                {$lookup: {
                    from: 'orders',
                    localField: 'orderIds',
                    foreignField: '_id',
                    as: 'orders'
                }},
                {$lookup: {
                    from: 'tasks',
                    localField: 'taskIds',
                    foreignField: '_id',
                    as: 'tasks'
                }},
                {$lookup: {
                    from: 'notes',
                    localField: 'noteIds',
                    foreignField: '_id',
                    as: 'notes'
                }},
                {$lookup: {
                    from: 'customers',
                    localField: 'employees.customerId',
                    foreignField: '_id',
                    as: 'employeesList'
                }},
                {$project: {
                    '_id': 1,
                    phones: 1,
                    emails: 1,
                    title: 1,
                    addressPostalCode: 1,
                    addressCity: 1,
                    addressStreet: 1,
                    addressHome: 1,
                    addressRoom: 1,
                    site: 1,
                    description: 1,
                    assignedUserId: 1,
                    createdById: 1,
                    createdByLogin: 1,
                    createdAt: 1,
                    'documents._id': 1,
                    'documents.name': 1,
                    'assignedUserLogin.login': 1,
                    employees: 1,
                    'employeesList._id': 1,
                    'employeesList.surname': 1,
                    'employeesList.name': 1,
                    'employeesList.patronym': 1
                }}
            ]);

            company[0].employeesList.map(employee => {
                employee.position = company[0].employees.find(el => {
                    if ((el.customerId).toString() === (employee._id).toString()) return el;
                    return false;
                }).position;
            });

            delete company[0].employees;

            res.status(200).json(company);

        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createCompany = async (req, res) => {

    try {

        // Проверка на заполнение телефонов
        if (req.body.phones) {
            for (let i = 0; i < req.body.phones.length; i++) { 
                if (req.body.phones[i].trim() === '') {
                    return res.status(409).json({errors: 'Номер телефона не может быть пустым'});
                }
            }
        }

        // Проверка на заполнение email
        if (req.body.emails) {
            for (let i = 0; i < req.body.emails.length; i++) { 
                if (req.body.emails[i].trim() === '') {
                    return res.status(409).json({errors: 'Email не может быть пустым'});
                }
            }
        }

        // Проверка на выбор документа
        if (req.body.documentIds) {
            for (let i = 0; i < req.body.documentIds.length; i++) { 
                if (req.body.documentIds[i].trim() === '') {
                    return res.status(409).json({errors: 'Документ должен быть выбран'});
                }
            }
        }

        // Проверка email
        const candidate = await Companies.findOne({emails: {$in: req.body.emails}});

        if (candidate) {
            return res.status(409).json({errors: 'Компания с таким email уже существует'});
        }

        const company = await new Companies({
            title: req.body.title,
            addressPostalCode: req.body.addressPostalCode,
            addressCity: req.body.addressCity,
            addressStreet: req.body.addressStreet,
            addressHome: req.body.addressHome,
            addressRoom: req.body.addressRoom,
            phones: req.body.phones,
            emails: req.body.emails,
            site: req.body.site,
            description: req.body.description,
            assignedUserId: req.user.role === 'manager' ? req.user.id : req.body.assignedUserId,
            documentIds: req.body.documentIds,
            createdById: req.user.id,
            createdByLogin: req.user.login
        }).save();

        res.status(201).json(company);
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateCompany = async (req, res) => {

    try {

        const company = await Companies.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            company.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете редактировать эту компанию'});
        }

        const candidate = await Companies.findOne(
            {$and: [
                {emails: {$in: req.body.emails}},
                {_id: {$ne: req.params.id}}
            ]}
        );

        if (candidate) {
            return res.status(409).json({errors: 'Компания с таким email уже существует'});
        } else if (
            req.body.title.trim() === '' ||
            req.body.addressPostalCode.trim() === '' ||
            req.body.addressCity.trim() === '' ||
            req.body.addressStreet.trim() === '' ||
            req.body.addressHome.trim() === '' ||
            req.body.phones.length === 0 ||
            req.body.emails.length === 0 ||
            req.body.assignedUserId.trim() === '' ||
            req.body.documentIds.length === 0
        ) {
            return res.status(409).json({errors: 'Заполните обязательные поля'});
        } else {

            // Проверка на заполнение телефонов
            if (req.body.phones) {
                for (let i = 0; i < req.body.phones.length; i++) { 
                    if (req.body.phones[i].trim() === '') {
                        return res.status(409).json({errors: 'Номер телефона не может быть пустым'});
                    }
                }
            }

            // Проверка на заполнение email
            if (req.body.emails) {
                for (let i = 0; i < req.body.emails.length; i++) { 
                    if (req.body.emails[i].trim() === '') {
                        return res.status(409).json({errors: 'Email не может быть пустым'});
                    }
                }
            }

            // Проверка на выбор документа
            if (req.body.documentIds) {
                for (let i = 0; i < req.body.documentIds.length; i++) { 
                    if (req.body.documentIds[i].trim() === '') {
                        return res.status(409).json({errors: 'Документ должен быть выбран'});
                    }
                }
            }

            const newCompany = await Companies.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    addressPostalCode: req.body.addressPostalCode,
                    addressCity: req.body.addressCity,
                    addressStreet: req.body.addressStreet,
                    addressHome: req.body.addressHome,
                    addressRoom: req.body.addressRoom,
                    phones: req.body.phones,
                    emails: req.body.emails,
                    site: req.body.site,
                    description: req.body.description,
                    assignedUserId: req.user.role === 'manager' ? req.user.id : req.body.assignedUserId,
                    documentIds: req.body.documentIds
                }},
                {new: true}
            );

            res.status(200).json(newCompany);
        }
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeCompany = async (req, res) => {

    try {

        const company = await Companies.findById(req.params.id);

        // Ограничение прав удаления
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            company.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить эту компанию'});
        } else {
            await Companies.deleteOne({_id: req.params.id});

            // Удаляем связанные с компанией истории общения и активные задачи
            await Notes.deleteMany({parentId: req.params.id});
            await Tasks.deleteMany(
                {$and: [
                    {parentId: req.params.id},
                    {status: {$in: ['not_started', 'started', 'deffered']}}
                ]}
            );

            return res.status(200).json({message: 'Компания успешно удалена.'});
        }
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.addEmployee = async (req, res) => {

    try {

        const company = await Companies.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            company.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете редактировать эту компанию'});
        }

        if (req.body.position.trim() === '') {
            return res.status(409).json({errors: 'Должность обязательна для заполнения.'});
        }

        const newCompany = await Companies.findOneAndUpdate(
            {
                _id: req.params.id,
                'employees.customerId': req.query.customerId
            },
            {$set: {
                'employees.$.position': req.body.position
            }},
            {new: true}
        );

        res.status(200).json(newCompany);

    } catch (err) {
        return errorHandler(res, err);
    }

}

module.exports.editEmployee = async (req, res) => {

    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }

}