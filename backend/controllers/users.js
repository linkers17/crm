const Users = require('../models/Users');
const Customers = require('../models/Customers');
const Companies = require('../models/Companies');
const findAccess = require('../utils/findAccess');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getUserByIdForRole = async (req, res) => {

    // director -> 5f97c367e890e82ac8c6003f
    // admin -> 5f982c4da87f830668df9bbd
    // manager -> 5f982c84a87f830668df9bbe

    // req.params.body -> id редактируемого пользователя

    const id = req.params.id;
    const user = await Users.findById(id, 'login email surname name role status');  // TODO - статус вывел для изменения и статуса по этому роуту

    if (!user) {
        return res.status(404).json({errors: 'Такого пользователя не существует или он был удален'});
    } else {
        if (!findAccess(req.user.role, user.role)) {
            return res.status(403).json({errors: 'У вас недостаточно прав для просмотра этой страницы'});
        } else {
            return res.status(200).json(user);
        }
    }

};

module.exports.getUserById = async (req, res) => {

    try {

        const candidate = await Users.findById(req.params.id);

        if (!candidate) {
            res.status(404).json({errors: 'Пользователь не найден, возможно он был удален.'});
        } else {
            
            const user = await Users.aggregate([
                {$match: {
                    '_id': mongoose.Types.ObjectId(req.params.id)
                }},
                {$lookup: {
                    from: 'contacts',
                    localField: 'contacts.contactId',
                    foreignField: '_id',
                    as: 'contactsList'
                }},
                {$project: {
                    '_id': 1,
                    userImg: 1,
                    login: 1,
                    role: 1,
                    surname: 1,
                    name: 1,
                    patronym: 1,
                    bithday: 1,
                    address: 1,
                    email: 1,
                    phones: 1,
                    contacts: 1,
                    'contactsList._id': 1,
                    'contactsList.img': 1,
                    'contactsList.name': 1
                }}
            ]);

            user[0].contactsList.map(contact => {
                contact.value = user[0].contacts.find(el => {
                    if ((el.contactId).toString() === (contact._id).toString()) return el;
                    return false;
                }).value;
            });

            delete user[0].contacts;

            res.status(200).json(user);
        }

    } catch (err) {
        return errorHandler(res, err);
    }

}

module.exports.updateUserById = async (req, res) => {

    const id = req.params.id;

    if (!findAccess(req.user.role, req.params.role)) {
        return res.status(403).json({errors: 'У вас недостаточно прав для редактирования этой страницы'});
    } else {
       if (req.user.role === 'admin' && req.body.role === 'director') {
           return res.status(403).json({
               errors: 'Администратор не может давать пользователю роль директора'
           });
        } else {

            // Меняем роль пользователя

            try {

                const user = await Users.findOneAndUpdate(
                    {_id: id},
                    { $set: {
                        role: req.body.role,
                        status: req.body.status
                        }
                    },
                    {new: true}
                );

                // Если пользователь стал неактивен переводим его клиентов и компании текущему
                if (!req.body.status) {
                    await Customers.updateMany(
                        {assignedUserId: id},
                        {$set: {
                            assignedUserId: req.user.id
                        }}
                    );

                    await Companies.updateMany(
                        {assignedUserId: id},
                        {$set: {
                            assignedUserId: req.user.id
                        }}
                    );
                }

                res.status(200).json({
                    login: user.login,
                    email: user.email,
                    surname: user.surname,
                    name: user.name,
                    role: user.role,
                    status: user.status
                });

            } catch (err) {
                errorHandler(res, err);
            }
        }
    }    

};

module.exports.getUsers = async (req, res) => {

    try {

        const query = {};

        if (req.query.login) {
            query.login = req.query.login;
        }

        if (req.query.surname) {
            query.surname = req.query.surname;
        }

        if (req.query.status) {
            query.status = req.query.status;
        }

        if (req.query.director || req.query.admin || req.query.manager) {
            query['$or'] = [
                {role: req.query.director ? 'director' : null},
                {role: req.query.admin ? 'admin' : null},
                {role: req.query.manager ? 'manager' : null},
            ]
        }

        const users = await Users.find(query, 'login role status surname name patronym').skip(+req.query.offset).limit(+req.query.limit);
        const usersCount = await Users.countDocuments();

        res.status(200).json({users, count: usersCount});

    } catch (err) {
        return errorHandler(res, err);
    }

};