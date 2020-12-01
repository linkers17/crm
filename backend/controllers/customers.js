const Customers = require('../models/Customers');
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
            createdByLogin: req.user.login
        }).save();

        res.status(201).json(customer);
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateCustomer = async (req, res) => {

    try {


        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeCustomer = async (req, res) => {

    try {


        
    } catch (err) {
        return errorHandler(res, err);
    }
}