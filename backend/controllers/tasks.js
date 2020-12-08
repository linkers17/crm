const Tasks = require('../models/Tasks');
const errorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

module.exports.getTasks = async (req, res) => {

    try {

        

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