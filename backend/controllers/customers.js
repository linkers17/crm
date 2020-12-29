const Customers = require('../models/Customers');
const Notes = require('../models/Notes');
const Tasks  =require('../models/Tasks');
const Contacts  =require('../models/Contacts');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getCustomers = async (req, res) => {

    try {

        const query = {};

        if (req.user.role === 'manager') {
            query.assignedUserId = mongoose.Types.ObjectId(req.user.id);
        }

        if (req.query.surname) {
            query.surname = req.query.surname;
        }

        if (req.query.birthday) {
            query.birthday = new Date(req.query.birthday);
        }

        if (req.query.email) {
            query.email = req.query.email;
        }

        // Данный параметр доступен только директорам и админам
        if (req.query.assignedUserId) {
            query.assignedUserId = mongoose.Types.ObjectId(req.query.assignedUserId);
        }

        const customers = await Customers.aggregate([
            {$match: query},
            {$lookup: {
                from: 'users',
                localField: 'assignedUserId',
                foreignField: '_id',
                as: 'assignedUserLogin'
            }},
            {$project: {
                '_id': 1,
                surname: 1,
                name: 1,
                patronym: 1,
                birthday: 1,
                email: 1,
                assignedUserId: 1,
                'assignedUserLogin.login': 1
            }}
        ]);
        const customersCount = await Customers.countDocuments();

        res.status(200).json({customers, customersCount});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getCustomerById = async (req, res) => {

    try {

        const candidate = await Customers.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({errors: 'Клиент не найден, возможно он был удален.'});
        } else if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            candidate.assignedUserId != req.user.id) {
            return res.status(409).json({errors: 'У вас недостаточно прав для просмотра'});
        } else {

            const customer = await Customers.aggregate([
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
                    from: 'contacts',
                    localField: 'contacts.contactId',
                    foreignField: '_id',
                    as: 'contactsList'
                }},
                {$project: {
                    '_id': 1,
                    phones: 1,
                    doNotCall: 1,
                    surname: 1,
                    name: 1,
                    patronym: 1,
                    birthday: 1,
                    addressPostalCode: 1,
                    addressCity: 1,
                    addressStreet: 1,
                    addressHome: 1,
                    addressRoom: 1,
                    email: 1,
                    site: 1,
                    description: 1,
                    assignedUserId: 1,
                    createdById: 1,
                    createdByLogin: 1,
                    createdAt: 1,
                    'documents._id': 1,
                    'documents.name': 1,
                    'assignedUserLogin.login': 1,
                    contacts: 1,
                    'contactsList._id': 1,
                    'contactsList.img': 1,
                    'contactsList.name': 1
                }}
            ]);

            customer[0].contactsList.map(contact => {
                contact.value = customer[0].contacts.find(el => {
                    if ((el.contactId).toString() === (contact._id).toString()) return el;
                    return false;
                }).value;
            });

            delete customer[0].contacts;

            return res.status(200).json(customer);

        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createCustomer = async (req, res) => {

    try {

        // Проверка email
        const candidate = await Customers.findOne({email: req.body.email});

        if (candidate) {
            return res.status(409).json({errors: 'Клиент с таким email уже существует'});
        }

        // Проверка на заполнение телефонов
        if (req.body.phones) {
            for (let i = 0; i < req.body.phones.length; i++) { 
                if (req.body.phones[i].trim() === '') {
                    return res.status(409).json({errors: 'Номер телефона не может быть пустым'});
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

        // Заполняем id мессенджера или соц. сети и значение из формы
        let contactsUser;
        const contacts = await Contacts.find({}, 'id');
        contactsUser = contacts.map((id, idx) => {
            return {
                contactId: id._id,
                value: req.body.contacts[idx]
            }
        });

        const customer = await new Customers({
            surname: req.body.surname,
            name: req.body.name,
            patronym: req.body.patronym,
            birthday: req.body.birthday,
            addressPostalCode: req.body.addressPostalCode,
            addressCity: req.body.addressCity,
            addressStreet: req.body.addressStreet,
            addressHome: req.body.addressHome,
            addressRoom: req.body.addressRoom,
            phones: req.body.phones,
            email: req.body.email,
            site: req.body.site,
            description: req.body.description,
            doNotCall: req.body.doNotCall,
            assignedUserId: req.user.role === 'manager' ? req.user.id : req.body.assignedUserId,
            documentIds: req.body.documentIds,
            createdById: req.user.id,
            createdByLogin: req.user.login,
            contacts: contactsUser
        }).save();

        res.status(201).json(customer);
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateCustomer = async (req, res) => {

    try {

        const customer = await Customers.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            customer.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете редактировать этого клиента'});
        }

        const candidate = await Customers.findOne(
            {$and: [
                {email: req.body.email},
                {_id: {$ne: req.params.id}}
            ]}
        );

        if (candidate) {
            return res.status(409).json({errors: 'Клиент с таким email уже существует'});
        } else if (
            req.body.surname.trim() === '' ||
            req.body.name.trim() === '' ||
            req.body.patronym.trim() === '' ||
            req.body.birthday.trim() === '' ||
            req.body.addressPostalCode.trim() === '' ||
            req.body.addressCity.trim() === '' ||
            req.body.addressStreet.trim() === '' ||
            req.body.addressHome.trim() === '' ||
            req.body.addressRoom.trim() === '' ||
            req.body.phones.length === 0 ||
            req.body.email.trim() === '' ||
            req.body.assignedUserId.trim() === ''
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

            // Проверка на заполнение документов
            if (req.body.documentIds) {
                for (let i = 0; i < req.body.documentIds.length; i++) { 
                    if (req.body.documentIds[i].trim() === '') {
                        return res.status(409).json({errors: 'Выберите документ'});
                    }
                }
            }

            // Заполняем id мессенджера или соц. сети и значение из формы
            let contactsUser;
            const contacts = await Contacts.find({}, 'id');
            contactsUser = contacts.map((id, idx) => {
                return {
                    contactId: id._id,
                    value: req.body.contacts[idx]
                }
            });

            const newCustomer = await Customers.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        surname: req.body.surname,
                        name: req.body.name,
                        patronym: req.body.patronym,
                        birthday: req.body.birthday,
                        addressPostalCode: req.body.addressPostalCode,
                        addressCity: req.body.addressCity,
                        addressStreet: req.body.addressStreet,
                        addressHome: req.body.addressHome,
                        addressRoom: req.body.addressRoom,
                        phones: req.body.phones,
                        email: req.body.email,
                        site: req.body.site,
                        description: req.body.description,
                        doNotCall: req.body.doNotCall,
                        assignedUserId: req.user.role === 'manager' ? req.user.id : req.body.assignedUserId,
                        documentIds: req.body.documentIds,
                        contacts: contactsUser
                    }
                },
                {new: true}
            );

            res.status(200).json(newCustomer);

        }
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeCustomer = async (req, res) => {

    try {

        const customer = await Customers.findById(req.params.id);

        // Ограничение прав удаления
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            customer.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить этого клиента'});
        } else {
            await Customers.deleteOne({_id: req.params.id});

            // Удаляем связанные с клиентом истории общения и активные задачи
            await Notes.deleteMany({parentId: req.params.id});
            await Tasks.deleteMany(
                {$and: [
                    {parentId: req.params.id},
                    {status: {$in: ['not_started', 'started', 'deffered']}}
                ]}
            );

            return res.status(200).json({message: 'Клиент успешно удален.'});
        }
        
    } catch (err) {
        return errorHandler(res, err);
    }
}