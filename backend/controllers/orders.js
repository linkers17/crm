const Orders = require('../models/Orders');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getOrders = async (req, res) => {
    try {

        // По-умолчанию отображаются заказы, в которых пользователь ответственный
        const query = {};
        if (req.user.role === 'manager') {
            query.assignedUserId = mongoose.Types.ObjectId(req.user.id);
        }

        // Фильтр стадий заказа
        if (
            req.query.prospecting ||
            req.query.offer ||
            req.query.negotiation ||
            req.query.closedWon ||
            req.query.closedLoose
        ) {
            const stage = {$in: []};
            req.query.prospecting ? stage.$in.push('prospecting') : false;
            req.query.offer ? stage.$in.push('offer') : false;
            req.query.negotiation ? stage.$in.push('negotiation') : false;
            req.query.closedWon ? stage.$in.push('closed won') : false;
            req.query.closedLoose ? stage.$in.push('closed loose') : false;
            query.stage = stage;
        }

        // Фильтр стоимости заказа
        if (req.query.minAmount) {
            query.amount = {
                $gte: +req.query.minAmount
            }
        }

        if (req.query.maxAmount) {
            if (!query.amount) {
                query.amount = {};
            }
            query.amount['$lte'] = +req.query.maxAmount;
        }

        // Фильтр даты завершения заказа
        if (req.query.startDateEnd) {
            query.dateEnd = {
                $gte: req.query.startDateEnd
            }
        }

        if (req.query.endDateEnd) {
            if (!query.dateEnd) {
                query.dateEnd = {};
            }
            query.dateEnd['$lte'] = req.query.endDateEnd;
        }

        console.log('query', query);

        const orders = await Orders.find(query, 'stage title dateEnd amount createdByLogin createdById createdAt');
        const count = await Orders.countDocuments(query);

        res.status(200).json({orders, count});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getOrderById = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createOrder = async (req, res) => {
    try {

        const candidate = await Orders.findOne({title: req.body.title});

        if (candidate) {
            return res.status(409).json({errors: 'Заказ с таким названием уже существует.'});
        } else {

            // Проверяем наличие услуг
            if (req.body.servicesList.length === 0) {
                return res.status(409).json({errors: 'Необходимо добавить услугу(и).'});
            }

            // Проверка на ответственного пользователя
            const assignedUserId = req.body.assignedUserId ? req.body.assignedUserId : req.user.id;

            // Проверка на указание компании или клиента
            if (!req.body.customerId && !req.body.companyId) {
                return res.status(409).json({errors: 'Необходимо выбрать компанию или клиента.'});
            }

            // Проверка на выбор документа
            if (req.body.documentIds) {
                for (let i = 0; i < req.body.documentIds.length; i++) { 
                    if (req.body.documentIds[i].trim() === '') {
                        return res.status(409).json({errors: 'Документ должен быть выбран'});
                    }
                }
            }

            // Проверяем заполнение услуг и корректность количества
            const servicesListErrorsCount = req.body.servicesList.reduce((accumulator, currentValue) => {
                if (currentValue.title.trim() === '') accumulator.titleErrors++;
                if (+currentValue.quantity <= 0 || isNaN(+currentValue.quantity)) accumulator.quantityErrors++;
                return accumulator;
            },
            {titleErrors: 0, quantityErrors: 0});

            if (servicesListErrorsCount.titleErrors !== 0 ||
                servicesListErrorsCount.quantityErrors !== 0) {
                    return res.status(409).json({errors: 'Заполните корректные значения услуг, все поля должны быть заполнены'});
                }

            // Вычисляем стоимость заказа
            const amount = req.body.servicesList.reduce((accumulator, currentValue) => {
                return accumulator + +currentValue.amount * +currentValue.quantity
            }, 0);

            // Если создается уже завершенный заказ
            const dateEnd = (req.body.stage === 'closed won' || req.body.stage === 'closed loose') ? Date.now() : null;

            const order = await new Orders({
                title: req.body.title,
                stage: req.body.stage,
                servicesList: req.body.servicesList,
                dateEnd,
                assignedUserId: req.user.role === 'manager' ? req.user.id : assignedUserId,
                documentIds: req.body.documentIds,
                customerId: req.body.customerId ? req.body.customerId : null,
                companyId: req.body.companyId ? req.body.companyId : null,
                description: req.body.description,
                amount,
                createdById: req.user.id,
                createdByLogin: req.user.login
            }).save();

            res.status(201).json(order);

        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateOrder = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeOrder = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}