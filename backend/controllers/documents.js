const fs = require('fs');

const Documents = require('../models/Documents');
const errorHandler = require('../utils/errorHandler');

module.exports.getDocuments = async (req, res) => {
    try {

        const query = {
            folderId: null
        };

        if (req.query.folder) {
            query.folderId = req.query.folder;
        }

        const documents = await Documents.find(query, 'status assignedUserId id name type createdByLogin filePath createdAt');

        if (!documents) {
            return res.status(404).json({error: 'Ниодного документа не найдено'});
        } else {
            return res.status(200).json(documents);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getDocumentById = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createDocument = async (req, res) => {

    req.body.folderId = req.body.folderId ? req.body.folderId : null;

    try {

        const candidate = await Documents.findOne({
            name: req.body.name,
            folderId: req.body.folderId
        });

        if (candidate) {

            // Удаляем файл в случае ошибки запроса
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            })

            return res.status(409).json({errors: 'Файл с таким именем уже есть.'});
        } else {
            const document = await new Documents({
                name: req.body.name,
                status: req.body.status,
                type: req.body.type ? req.body.type : null,
                createdById: req.user.id,
                createdByLogin: req.user.login,
                assignedUserId: req.body.assignedUserId ? req.body.assignedUserId : null,
                folderId: req.body.folderId ? req.body.folderId : null,
                description: req.body.description,
                filePath: req.file.path
            }).save();

            return res.status(201).json(document);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateDocument = async (req, res) => {

    req.body.folderId = req.body.folderId ? req.body.folderId : null;

    try {

        const document = await Documents.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            document.createdById != req.user.id && document.assignedUserId != req.user.id) {

            // Удаляем файл в случае ошибки запроса
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            });
            
            return res.status(409).json({errors: 'Вы не можете редактировать этот документ'});
        }

        // Если поле "имя документа" или "файл" пустое
        if (req.body.name.trim() === '' || !req.file) {

            // Удаляем файл в случае ошибки запроса
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            });

            return res.status(409).json({errors: 'Имя документа и файл обязательны для заполнения'});
        }

        // Проверяем имя файла на уникальность
        const candidate = await Documents.findOne({
            name: req.body.name,
            folderId: req.body.folderId
        });

        if (candidate) {

            // Удаляем файл в случае ошибки запроса
            fs.unlink(req.file.path, err => {
                if (err) throw err;
            })

            return res.status(409).json({errors: 'Файл с таким именем уже есть.'});
        } else {

            const newDocument = await Documents.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        name: req.body.name,
                        status: req.body.status,
                        type: req.body.type ? req.body.type : null,
                        assignedUserId: req.body.assignedUserId ? req.body.assignedUserId : null,
                        folderId: req.body.folderId ? req.body.folderId : null,
                        description: req.body.description,
                        filePath: req.file.path,
                        updatedById: req.user.id,
                        updatedByLogin: req.user.login
                    }
                },
                {new: true}
            );
            // Удаляем старый файл
            fs.unlink(document.filePath, err => {
                if (err) throw err;
            });

            res.status(200).json(newDocument);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeDocument = async (req, res) => {
    try {

        const document = await Documents.findById(req.params.id);

        // Ограничение прав удаления
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            document.createdById != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить этот файл'});
        } else {
            await Documents.deleteOne({_id: req.params.id});

            // Удаляем файл c сервера
            fs.unlink(document.filePath, err => {
                if (err) throw err;
            });

            return res.status(200).json({message: 'Документ успешно удален.'});
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}