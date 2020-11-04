const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');
const Contacts = require('../models/Contacts');
const errorHandler = require('../utils/errorHandler');
const {tlt, jwtSecret} = require('../config/config');

module.exports.login = async (req, res) => {

    const candidate = await User.findOne({login: req.body.login});

    if (candidate) {

        if (!candidate.status) {
            res.status(401).json({errors: 'Ваш аккаунт отключен'});
        } else {

            const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

            if (passwordResult) {
                const token = jwt.sign({
                    userId: candidate._id,
                    login: candidate.login,
                    role: candidate.role
                }, jwtSecret, {expiresIn: tlt});

                return res.status(200).json({
                    currentUser: {
                        login: candidate.login,
                        role: candidate.role,
                        userImg: candidate.userImg,
                        token: `Bearer ${token}`
                    }
                });
            } else {
                return res.status(401).json({errors: ['Неверный пароль']});
            }

        }

    } else {
        return res.status(404).json({errors: ['Пользователь с таким логином не найден']});
    }

};

module.exports.register = async (req, res) => {

    // Проверить email и login
    const candidateIsLogin = await User.findOne({login: req.body.login});
    const candidateIsEmail = await User.findOne({email: req.body.email});

    if (candidateIsLogin && candidateIsEmail === null) {
        return res.status(409).json({errors: ['Пользователь с таким логином уже зарегистрирован']});
    }

    if (candidateIsEmail && candidateIsLogin === null) {
        return res.status(409).json({errors: ['Пользователь с таким email уже зарегистрирован']});
    }

    if (candidateIsEmail && candidateIsLogin) {
        return res.status(409).json({errors: [
                'Пользователь с таким email уже зарегистрирован',
                'Пользователь с таким логином уже зарегистрирован'
            ]});
    }

    const salt = bcrypt.genSaltSync(10);    // Соль для хеширования пароля
    const password = req.body.password;

    // Проверка на заполнение телефонов
    if (req.body.phones) {
        for (let i = 0; i < req.body.phones.length; i++) { 
            if (req.body.phones[i].trim() === '') {
                return res.status(409).json({errors: 'Номер телефона не может быть пустым'});
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

    const user = new User({
        login: req.body.login,
        password: bcrypt.hashSync(password, salt),
        surname: req.body.surname,
        name: req.body.name,
        patronym: req.body.patronym,
        bithday: req.body.bithday,
        userImg: req.file ? req.file.path : 'uploads\\no-photo.png',
        address: req.body.address,
        email: req.body.email,
        phones: req.body.phones,
        contacts: contactsUser
    });

    try {
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        errorHandler(res, e);
    }
};
