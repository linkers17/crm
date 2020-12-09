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

        const candidate = await Tasks.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({errors: 'Задача не найдена, возможно она была удалена.'});
        } else {

            // Ограничение прав просмотра
            if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            candidate.createdById != req.user.id && candidate.assignedUserId != req.user.id) {
                return res.status(409).json({errors: 'У вас недостаточно прав для просмотра этой страницы'});
            }

            const task = await Tasks.aggregate([
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
                {$project: {
                    '_id': 1,
                    dateEnd: 1,
                    status: 1,
                    priority: 1,
                    updatedById: 1,
                    updatedByLogin: 1,
                    updatedAt: 1,
                    assignedUserId: 1,
                    parentId: 1,
                    title: 1,
                    description: 1,
                    createdById: 1,
                    createdByLogin: 1,
                    createdAt: 1,
                    deadline: 1,
                    'documents._id': 1,
                    'documents.name': 1,
                    'assignedUserLogin.login': 1
                }}
            ]);

            res.status(200).json(task);
        }

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

        const task = await Tasks.findById(req.params.id);

        console.log('task', task);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
        task.createdById != req.user.id && task.assignedUserId != req.user.id) {
            return res.status(409).json({errors: 'Вы не можете редактировать эту задачу.'});
        }

        // Если статус задачи "завершена"
        const dateEnd = req.body.status === 'completed' ? Date.now() : null;

        if (req.body.title.trim() === '') {
            return res.status(409).json({errors: 'Название задачи обязательно для заполнения'})
        }

        // Проверка на выбор документа
        if (req.body.documentIds) {
            for (let i = 0; i < req.body.documentIds.length; i++) { 
                if (req.body.documentIds[i].trim() === '') {
                    return res.status(409).json({errors: 'Документ должен быть выбран'});
                }
            }
        }

        const newTask = await Tasks.findOneAndUpdate(
            {_id: req.params.id},
            {$set: {
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                priority: req.body.priority,
                status: req.body.status,
                parentId: req.body.parentId ? req.body.parentId : null,
                dateEnd,
                documentIds: req.body.documentIds,
                updatedById: req.user.id,
                updatedByLogin: req.user.login
            }},
            {new: true}
        );

        res.status(200).json(newTask);
        
    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeTask = async (req, res) => {

    try {

        const task = await Tasks.findById(req.params.id);

        // Ограничение прав удаления
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            task.createdById != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить эту задачу.'});
        } else {
            await Tasks.deleteOne({_id: req.params.id});

            return res.status(200).json({message: 'Задача успешно удалена.'});
        }
        
    } catch (err) {
        return errorHandler(res, err);
    }
}