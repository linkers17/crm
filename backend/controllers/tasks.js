const Tasks = require('../models/Tasks');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getTasks = async (req, res) => {

    try {

        // По-умолчанию отображаются задачи, в которых пользователь ответственный
        let query = {
            assignedUserId: req.user.id
        };

        // Если нужно получить задачи, которые создал пользователь
        if (req.query.createdMe) {
            query = {
                $or: [
                    {assignedUserId: req.user.id},
                    {createdById: req.user.id}
                ]
            }
        }

        // Фильтр статусов и приоритетов
        if (
            req.query.normal ||
            req.query.low ||
            req.query.high ||
            req.query.urgent
        ) {

            const priority = {$in: []};
            req.query.normal ? priority.$in.push('normal') : false;
            req.query.low ? priority.$in.push('low') : false;
            req.query.high ? priority.$in.push('high') : false;
            req.query.urgent ? priority.$in.push('urgent') : false;

            // Если есть параметры приоритета и "создан мной" одновременно
            if (req.query.createdMe) {
                query = {
                    $and: [
                        {$or: [
                            {assignedUserId: req.user.id},
                            {createdById: req.user.id}
                        ]},
                        {$and: [{priority}]}
                    ]
                };
            } else {
                query = {
                    $and: [
                        {$or: [
                            {assignedUserId: req.user.id}
                        ]},
                        {$and: [{priority}]}
                    ]
                };
            }
        }

        if (
            req.query.notStarted ||
            req.query.started ||
            req.query.completed ||
            req.query.canceled ||
            req.query.deffered
        ) {
            const status = {$in: []};
            req.query.notStarted ? status.$in.push('not_started') : false;
            req.query.started ? status.$in.push('started') : false;
            req.query.completed ? status.$in.push('completed') : false;
            req.query.canceled ? status.$in.push('canceled') : false;
            req.query.deffered ? status.$in.push('deffered') : false;

            // Если есть параметры статуса и "создан мной" одновременно
            if (req.query.createdMe) {
                if (query.$and) {
                    query.$and[1].$and.push({status});
                } else {
                    query = {
                        $and: [
                            {$or: [
                                {assignedUserId: req.user.id},
                                {createdById: req.user.id}
                            ]},
                            {$and: [{status}]}
                        ]
                    };
                }
            } else {
                if (query.$and) {
                    query.$and[1].$and.push({status});
                } else {
                    query = {
                        $and: [
                            {$or: [
                                {assignedUserId: req.user.id}
                            ]},
                            {$and: [{status}]}
                        ]
                    };
                }
            }
        }

        const tasks = await Tasks.find(query, 'status priority assignedUserId title deadline createdById createdByLogin createdAt');
        const count = await Tasks.countDocuments(query);

        res.status(200).json({tasks, count});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getTaskById = async (req, res) => {

    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createTask = async (req, res) => {

    try {

        const parentId = req.query.parentId ? req.query.parentId : null;
        
        // Если создается уже завершенная задача
        const dateEnd = req.body.status === 'completed' ? Date.now() : null;

        // Проверка на выбор документа
        if (req.body.documentIds) {
            for (let i = 0; i < req.body.documentIds.length; i++) { 
                if (req.body.documentIds[i].trim() === '') {
                    return res.status(409).json({errors: 'Документ должен быть выбран'});
                }
            }
        }

        const task = await new Tasks({
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            priority: req.body.priority,
            status: req.body.status,
            parentId,
            dateEnd,
            documentIds: req.body.documentIds,
            assignedUserId: req.body.assignedUserId ? req.body.assignedUserId : req.user.id, 
            createdById: req.user.id,
            createdByLogin: req.user.login

        }).save();

        res.status(201).json(task);
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateTask = async (req, res) => {

    try {

        
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeTask = async (req, res) => {

    try {

        
        
    } catch (err) {
        return errorHandler(res, err);
    }
}