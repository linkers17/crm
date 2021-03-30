const Orders = require('../models/Orders');
const Tasks = require('../models/Tasks');
const Notes = require('../models/Notes');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getOrders = async (req, res) => {
    try {

        const limit = +req.query.limit;
        const offset = +req.query.offset;
        const sort = {};
        req.query.sortActive ? sort[req.query.sortActive] = req.query.sortDirection === 'asc' ? 1 : -1 : false;

        // По-умолчанию отображаются заказы, в которых пользователь ответственный
        const query = {};
        if (req.user.role === 'manager') {
            query.assignedUserId = mongoose.Types.ObjectId(req.user.id);
        }

        // Фильтр ответственного менеджера
        if (req.query.assignedUserId && req.user.role !== 'manager') {
            query.assignedUserId = mongoose.Types.ObjectId(req.query.assignedUserId);
        }

        // Фильтр клиента
        if (req.query.customerId) {
            query.customerId = mongoose.Types.ObjectId(req.query.customerId);
        }

        // Фильтр компании
        if (req.query.companyId) {
            query.companyId = mongoose.Types.ObjectId(req.query.companyId);
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
                $gte: new Date(req.query.startDateEnd)
            }
        }

        if (req.query.endDateEnd) {
            if (!query.dateEnd) {
                query.dateEnd = {};
            }
            query.dateEnd['$lte'] = new Date(req.query.endDateEnd);
        }

        let orders = Orders.aggregate([
            {$match: query},
            {$lookup: {
                    from: 'users',
                    localField: 'assignedUserId',
                    foreignField: '_id',
                    as: 'assignedUserLogin'
                }},
            {$project: {
                    '_id': 1,
                    stage: 1,
                    dateEnd: 1,
                    title: 1,
                    amount: 1,
                    createdById: 1,
                    createdByLogin: 1,
                    createdAt: 1,
                    assignedUserId: 1,
                    'assignedUserLogin.login': 1
                }}
        ]);
        orders = req.query.sortActive ? await orders.sort(sort).skip(offset).limit(limit) : await orders.skip(offset).limit(limit);
        const ordersCount = await Orders.countDocuments(query);

        res.status(200).json({orders, ordersCount});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getOrderById = async (req, res) => {
    try {

        const candidate = await Orders.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({errors: 'Заказ не найден, возможно он был удален.'});
        } else if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            candidate.assignedUserId != req.user.id) {
            return res.status(409).json({errors: 'У вас недостаточно прав для просмотра.'});
        } else {
            const order = await Orders.aggregate([
                {$match: {
                    '_id': mongoose.Types.ObjectId(req.params.id)
                }},
                {$lookup: {
                    from: 'documents',
                    localField: 'documentIds',
                    foreignField: '_id',
                    as: 'documents'
                }},
                {$lookup: {
                    from: 'users',
                    localField: 'assignedUserId',
                    foreignField: '_id',
                    as: 'assignedUserLogin'
                }},
                {$lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerInfo'
                }},
                {$lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'companyInfo'
                }},
                {$project: {
                    '_id': 1,
                    stage: 1,
                    title: 1,
                    dateEnd: 1,
                    servicesList: 1,
                    amount: 1,
                    createdByLogin: 1,
                    createdById: 1,
                    createdAt: 1,
                    updatedByLogin: 1,
                    updatedById: 1,
                    updatedAt: 1,
                    assignedUserId: 1,
                    description: 1,
                    'documents._id': 1,
                    'documents.name': 1,
                    'assignedUserLogin.login': 1,
                    'customerInfo.surname': 1,
                    'customerInfo.name': 1,
                    'customerInfo.patronym': 1,
                    'companyInfo.title': 1
                }}
            ]);

            order[0].tasks = await Tasks.find({parentId: order[0]._id});
            order[0].notes = await Notes.find({parentId: order[0]._id});

            return res.status(200).json(order[0]);
        }

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

        const order = await Orders.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            order.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете редактировать этот заказ.'});
        }
        const candidate = await Orders.findOne(
            {$and: [
                {title: req.body.title},
                {_id: {$ne: req.params.id}}
            ]}
        );

        if (candidate) {
            return res.status(409).json({errors: 'Заказ с таким названием уже существует'});
        } else if (
            req.body.title.trim() === '' ||
            req.body.stage.trim() === '' ||
            req.body.servicesList.length === 0
        ) {
            return res.status(409).json({errors: 'Заполните обязательные поля'});
        } else {

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

            // Если заказ завершен
            const dateEnd = (req.body.stage === 'closed won' || req.body.stage === 'closed loose') ? Date.now() : null;

            const newOrder = await Orders.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
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
                        updatedById: req.user.id,
                        updatedByLogin: req.user.login
                    }
                },
                {new: true}
            );

            res.status(200).json(newOrder);

        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeOrder = async (req, res) => {
    try {

        const order = await Orders.findById(req.params.id);

        // Ограничение прав удаления
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            order.assignedUserId != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить этот заказ.'});
        } else {
            await Orders.deleteOne({_id: req.params.id});

            return res.status(200).json({message: 'Заказ успешно удален.'});
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}
