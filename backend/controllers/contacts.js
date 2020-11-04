const Contacts = require('../models/Contacts');
const errorHandler = require('../utils/errorHandler');

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

module.exports.addContact = async (req, res) => {
    const candidate = await Contacts.findOne({name: req.body.name});

    if (candidate) {
        res.status(409).json({
            errors: [
                'Мессенджер или соц. сеть с таким именем уже существует.'
            ]
        });
    } else {
        const contact = new Contacts({
            name: req.body.name,
            img: req.body.img
        });

        try {
            await contact.save();
            res.status(201).json(contact);
        } catch (e) {
            errorHandler(res, e);
        }
    }
}
