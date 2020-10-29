const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

// Роуты
const contactsRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

// Файл конфигураций
const config = require('./config/config');

const app = express();

// Соединение с БД и запуск сервера
const startApp = async () => {
    try {
        await mongoose.connect(config.dbURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true
        });
        console.log('MongoDB connected.');
        app.listen(config.PORT, () => console.log(`Server has been started on port: ${config.PORT}`));
    } catch (err) {
        console.log('MongoDB connected error:', err);
        startApp();
    }
}

// Инициализируем passport для авторизации
app.use(passport.initialize());
require('./middleware/passport')(passport);

// Регистрация дополнительных библиотек
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

// Регистрация роутов
app.use('/api/contacts', contactsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

startApp();