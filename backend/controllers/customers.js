const Customers = require('../models/Customers');
const errorHandler = require('../utils/errorHandler');

module.exports.getCustomers = async (req, res) => {

    try {



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

        console.log('body', req.body);

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
            assignedUserId: req.body.assignedUserId,
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