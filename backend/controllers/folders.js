const Folders = require('../models/Folders');
const errorHandler = require('../utils/errorHandler');

module.exports.getFolders = async (req, res) => {
    try {

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getFolderById = async (req, res) => {
    try {

    } catch (err) {
        return errorHandler(res, err);
    }
}

// 5fa9705c7dc0812c90f421dc -> Папка 1
// 5fa970ca753c882988e37ca9 -> Папка 2
// 5fa97106753c882988e37caa -> Папка 3 (1)
// 5fa9715d753c882988e37cab -> Папка 2 (1)
// 5fa97197753c882988e37cac -> Папка 3
module.exports.createFolder = async (req, res) => {
    try {

        const candidate = await Folders.findOne({
            name: req.body.name,
            parentId: req.body.parent
        });

        if (candidate) {
            return res.status(409).json({errors: 'Папка с таким именем уже существует.'});
        } else {
            const folder = await new Folders({
                name: req.body.name,
                description: req.body.description,
                createdById: req.user.id,
                createdByLogin: req.user.login,
                parentId: req.body.parent
            }).save();

            return res.status(201).json(folder);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateFolder = async (req, res) => {
    try {

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeFolder = async (req, res) => {
    try {

    } catch (err) {
        return errorHandler(res, err);
    }
}