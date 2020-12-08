const Notes = require('../models/Notes');
const errorHandler = require('../utils/errorHandler');

module.exports.getNotes = async (req, res) => {
    try {

        const notes = await Notes.find({parentId: req.query.parentId});

        if (!notes) {
            return res.status(404).json({errors: 'Ниодной заметки не найдено.'});
        }

        res.status(200).json(notes);

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getNoteById = async (req, res) => {
    try {

        const note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).json({errors: 'Заметка не найдена, возможно она была удалена.'});
        } else {
            res.status(200).json(note);
        }

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