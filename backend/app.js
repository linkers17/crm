const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

// Роуты
const contactsRoutes = require('./routes/contacts');
const rolesRoutes = require('./routes/roles');
const authRoutes = require('./routes/auth');

// Файл конфигураций
const config = require('./config/config');

const app = express();

// Соединение с БД
mongoose.connect(config.dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.log('MongoDB connected error:', err));

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
app.use('/api/roles', rolesRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
