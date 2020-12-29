const fs = require('fs');

const Contacts = require('../models/Contacts');
const Users = require('../models/Users');
const Customers = require('../models/Customers');
const Companies = require('../models/Companies');
const errorHandler = require('../utils/errorHandler');
const {PLACEHOLDER_CONTACT_PATH} = require('../config/config');

module.exports.getContacts = async (req, res) => {

    const contacts = await Contacts.find({}, (err, data) => {
        if (err) return errorHandler(res, err);
    });

    res.status(200).json(contacts);
}

module.exports.getContactById = async (req, res) => {

    try {

        const contact = await Contacts.findById(req.params.id);

        if (contact) {
            return res.status(200).json(contact);
        } else {
            return res.status(404).json({errors: 'Страница не найдена'});
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createContact = async (req, res) => {
    const candidate = await Contacts.findOne({name: req.body.name});

    if (candidate) {

        // Удаляем файл в случае ошибки запроса
        fs.unlink(req.file.path, err => {
            if (err) throw err;
        });

        res.status(409).json({
            errors: [
                'Мессенджер или соц. сеть с таким именем уже существует.'
            ]
        });
    } else {
        const contact = new Contacts({
            name: req.body.name,
            img: req.file ? req.file.path : PLACEHOLDER_CONTACT_PATH
        });

        try {
            // Добавляем в таблицу пользователей созданный контакт
            await Users.updateMany({}, {
                $push: {
                    contacts: {
                        contactId: contact._id,
                        value: ''
                    }
                }
            });

            // Добавляем в таблицу клиентов созданный контакт
            await Customers.updateMany({}, {
                $push: {
                    contacts: {
                        contactId: contact._id,
                        value: ''
                    }
                }
            });

            // Добавляем в таблицу компаний созданный контакт
            await Companies.updateMany({}, {
                $push: {
                    contacts: {
                        contactId: contact._id,
                        value: ''
                    }
                }
            });

            await contact.save();
            res.status(201).json(contact);
        } catch (e) {
            errorHandler(res, e);
        }
    }
}

module.exports.updateContact = async (req, res) => {
    try {

        const candidate = await Contacts.findOne(
            {$and: [
                {name: req.body.name},
                {_id: {$ne: req.params.id}}
            ]}
        );

        if (candidate) {

            // Удаляем файл в случае ошибки запроса
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) throw err;
                });
            }

            res.status(409).json({
                errors: [
                    'Мессенджер или соц. сеть с таким именем уже существует.'
                ]
            });
        } else {

            const contactInfo = await Contacts.findById(req.params.id);
            const contact = await Contacts.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    name: req.body.name,
                    img: req.file ? req.file.path : PLACEHOLDER_CONTACT_PATH
                }},
                {new: true}
            );

            // Удаляем старое изображение (кроме placeholder)
            if (contactInfo.img !== PLACEHOLDER_CONTACT_PATH) {
                fs.unlink(contactInfo.img, err => {
                    if (err) throw err;
                });
            }
    
            res.status(200).json(contact);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeContact = async (req, res) => {

    try {

        const contactInfo = await Contacts.findById(req.params.id);
        await Contacts.deleteOne({_id: req.params.id});

        // Обновляем список контактов в таблице пользователей
        await Users.updateMany({}, {
            $pull: {
                contacts: {
                    contactId: req.params.id
                }
            }
        });

        // Обновляем список контактов в таблице клиентов
        await Customers.updateMany({}, {
            $pull: {
                contacts: {
                    contactId: req.params.id
                }
            }
        });

        // Обновляем список контактов в таблице компаний
        await Companies.updateMany({}, {
            $pull: {
                contacts: {
                    contactId: req.params.id
                }
            }
        });

        // Удаляем изображение (кроме placeholder)
        if (contactInfo.img !== PLACEHOLDER_CONTACT_PATH) {
            fs.unlink(contactInfo.img, err => {
                if (err) throw err;
            });
        }

        res.status(200).json({message: 'Контакт успешно удален.'});

    } catch (err) {
        return errorHandler(res, err);
    }

}