const Folders = require('../models/Folders');
const Documents = require('../models/Documents');
const errorHandler = require('../utils/errorHandler');

module.exports.getFolders = async (req, res) => {
    try {

        const folders = await Folders.find({});

        if (!folders) {
            return res.status(404).json({errors: 'Ниодной папки не найдено'});
        } else {

            let makeTree = array => array.filter(item => {
                item._doc.childList = array.filter(i => i.parentId == item._id);
                return item.parentId === '';
            });

            const newFolders = makeTree(folders);

            res.json(newFolders);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getFolderById = async (req, res) => {
    try {

        const folder = await Folders.findById(req.params.id);

        if (!folder) {
            return res.status(404).json({errors: 'Такой папки не существует или она была удалена'});
        } else {

            // Ищем родителя
            let parent = null;
            if (folder.parentId) {
                parent = await Folders.findById(folder.parentId, 'id name');
            }

            // Ищем потомков
            const children = await Folders.find({parentId: folder._id}, 'id name');

            // Ищем документы в папке
            const documents = await Documents.find({folderId: folder._id}, 'id name filePath createdAt');

            return res.status(200).json({
                folder: {
                    folder,
                    parent,
                    children,
                    documents
                }
            });
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createFolder = async (req, res) => {
    try {

        const candidate = await Folders.findOne({
            name: req.body.name,
            parentId: req.body.parent
        });

        if (candidate) {
            return res.status(409).json({errors: 'Папка с таким именем уже существует.'});
        } else {
            
            let parents = [];
            if (req.body.parent) {
                console.log(1);
                parents = await Folders.findById(req.body.parent, 'parentIds');
                parents.parentIds.push(req.body.parent)
            }

            const folder = await new Folders({
                name: req.body.name,
                description: req.body.description,
                createdById: req.user.id,
                createdByLogin: req.user.login,
                parentId: req.body.parent,
                parentIds: parents.parentIds
                
            }).save();

            return res.status(201).json(folder);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

// 5faabfe09a92873bf4291ceb -> Тест 1
// 5faabff59a92873bf4291cec -> Тест 2
// 5faac7c400303a3e285679d1 -> Тест 3-1
// 5faac7e400303a3e285679d2 -> Тест 4-2
// 5faac7f900303a3e285679d3 -> Тест 5-1
// 5faac81000303a3e285679d4 -> Тест 6
// 5faac83500303a3e285679d5 -> Тест 7-6
// 5faac883dad32b2090390af3 -> Тест 8-7
// 5fb219d4d3272e3eb813fca7 -> Тест 9-6
// 5fb2ab0cbf5e14157869cf46 -> Тест 10
// 5fb2ab2dbf5e14157869cf47 -> Тест 11-10
// 5fb2ab50bf5e14157869cf48 -> Тест 12-10
// 5fb2ab6fbf5e14157869cf49 -> Тест 13-11
// 5fb2ab91bf5e14157869cf4a -> Тест 14-13

module.exports.updateFolder = async (req, res) => {
    try {

        const candidate = await Folders.findOne({
            name: req.body.name,
            parentId: req.body.parent
        });

        const folder = await Folders.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            folder.createdById != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете редактировать эту папку'});
        }

        // Если поле "название папки" пустое
        if (req.body.name.trim() === '') {
            return res.status(409).json({errors: 'Имя папки не может быть пустым'});
        }

        // Если имя папки уже занято
        if (candidate) {
            return res.status(409).json({errors: 'Папка с таким именем уже существует.'});
        } else {

            // Находим родителя, если он указан

            const parent = req.body.parent !== '' ? await Folders.findOne({_id: req.body.parent}) : null;

            const ids = parent ? [...parent.parentIds, req.body.parent] : [];

            const odlParentId = await Folders.findById({_id: req.params.id}, 'parentId parentIds');

            const folder = await Folders.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        name: req.body.name,
                        description: req.body.description,
                        updatedById: req.user.id,
                        updatedByLogin: req.user.login,
                        parentId: req.body.parent,
                        parentIds: ids
                    }
                },
                {new: true}
            );

            // Изменяем зависимости у детей  
            const children = await Folders.find({parentIds: {$in: [req.params.id]}});
            children.map(async (child) => {
                await Folders.updateOne({_id: child._id}, {$set: {parentIds: [...folder.parentIds, ...child.parentIds.filter(id => !odlParentId.parentIds.includes(id)/*id != odlParentId.parentId*/)]}})
            });

            res.status(200).json(folder);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeFolder = async (req, res) => {
    try {

        const folder = await Folders.findById(req.params.id);

        // Ограничение прав редактирования
        if (req.user.role !== 'director' && req.user.role !== 'admin' &&
            folder.createdById != req.user.id) {
            
            return res.status(409).json({errors: 'Вы не можете удалить эту папку'});
        } else {

            await Folders.deleteMany({$or: [
                {_id: req.params.id},
                {parentIds: {$in: [req.params.id]}}
            ]});

            return res.status(200).json({message: 'Папка успешно удалена'});

        }

    } catch (err) {
        return errorHandler(res, err);
    }
}