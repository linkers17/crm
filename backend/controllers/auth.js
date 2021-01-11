const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer  =require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');

const User = require('../models/Users');
const Contacts = require('../models/Contacts');
const errorHandler = require('../utils/errorHandler');
const resetEmail = require('../emails/resetEmail');
const {tlt, jwtSecret, EMAIL_FROM, EMAIL_PASS, TOKEN_EXP} = require('../config/config');

// Проверка пользователя по токену
module.exports.checkUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({errors: 'Что-то пошло не так.'});
        }

        const token = res.header().req.headers.authorization;

        return res.status(200).json({
            currentUser: {
                login: user.login,
                role: user.role,
                userImg: user.userImg,
                token: `${token}`
            }
        });

    } catch (err) {
        return errorHandler(res, err);
    }

}

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

        // Удаляем файл в случае ошибки запроса
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            });
        }

        return res.status(409).json({errors: ['Пользователь с таким логином уже зарегистрирован']});
    }

    if (candidateIsEmail && candidateIsLogin === null) {

        // Удаляем файл в случае ошибки запроса
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            });
        }

        return res.status(409).json({errors: ['Пользователь с таким email уже зарегистрирован']});
    }

    if (candidateIsEmail && candidateIsLogin) {

        // Удаляем файл в случае ошибки запроса
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            });
        }

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

                // Удаляем файл в случае ошибки запроса
                if (req.file) {
                    fs.unlink(req.file.path, err => {
                        if (err) throw err;
                    });
                }

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
        birthday: req.body.birthday,
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


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS
    }
});

module.exports.reset = async (req, res) => {
    try {

        // Генерируем рандомный ключ для токена
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return res.status(500).json({errors: 'Что-то пошло не так'});
            }

            const token = buffer.toString('hex'); // Получаем токен в случае успешной генерации ключа

            const candidate = await User.findOne({
                $or: [{login: req.body.user}, {email: req.body.user}]
            });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + TOKEN_EXP;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, candidate.name, token));
                return res.status(200).json({message: 'Письмо с дальнейшими инструкциями отправлено на эл. почту'});
            } else {
                return res.status(404).json({errors: 'Пользователь с таким email или логином не найден'});
            }
        });

    } catch (err) {
        return errorHandler(err);
    }
};

module.exports.updatePassword = async (req, res) => {

    try {

        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        });

        if (user) {

            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
                user.resetToken = undefined;
                user.resetTokenExp = undefined;
                await user.save();
                res.status(200).json({message: 'Пароль успешно обновлен.'});
            } else {
                res.status(409).json({errors: 'Пароль не может быть пустым'});
            }

            
        } else {
            res.status(409).json({errors: 'Время действия ссылки истекло.'});
        }

    } catch (err) {
        return errorHandler(err);
    }

};
