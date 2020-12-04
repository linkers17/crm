const Companies = require('../models/Companies');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getCompanies = async (req, res) => {

    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getCompanyById = async (req, res) => {

    try {

        

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

        
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeCompany = async (req, res) => {

    try {


        
    } catch (err) {
        return errorHandler(res, err);
    }
}