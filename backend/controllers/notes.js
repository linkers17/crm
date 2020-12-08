const Notes = require('../models/Notes');
const errorHandler = require('../utils/errorHandler');

module.exports.getNotes = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getNoteById = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createNote = async (req, res) => {
    try {

        if (!req.body.description) {
            return res.status(409).json({errors: 'Текст не может быть пустым'});
        } else {
            const note = await new Notes({
                createdById: req.user.id,
                createdByLogin: req.user.login,
                description: req.body.description,
                parentId: req.params.parentId
            }).save();

            res.status(201).json(note);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateNote = async (req, res) => {
    try {

        


    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeNote = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}