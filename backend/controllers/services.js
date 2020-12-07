const Services = require('../models/Services');
const errorHandler = require('../utils/errorHandler');

module.exports.getServices = async (req, res) => {
    try {

        const query = {};

        if (req.query.title) {
            query.title = req.query.title;
        }

        if (req.query.minAmount) {
            query.amount = {
                $gte: req.query.minAmount
            };
        }

        if (req.query.maxAmount) {
            if (!query.amount) {
                query.amount = {}
            }

            query.amount['$lte'] = req.query.maxAmount;
        }

        if (req.query.title) {
            query.title = req.query.title;
        }

        const services = await Services.find(query);
        const servicesCount = await Services.countDocuments(query);

        res.status(200).json({services, servicesCount});

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getServiceById = async (req, res) => {
    try {

        const service = await Services.findById(req.params.id);

        if (!service) {
            return res.status(404).json({errors: 'Услуга не найдена, возможно она была удалена.'});
        } else {
            return res.status(200).json(service);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.createService = async (req, res) => {
    try {

        const candidate = await Services.findOne({title: req.body.title});

        if (candidate) {
            return res.status(409).json({errors: 'Услуга с таким названием уже существует'});
        } else {

            // Проверяем стоимость на отрицательное значение
            if (+req.body.amount < 0) {
                return res.status(409).json({errors: 'Стоимость не может быть меньше 0.'});
            }

            const service = await new Services({
                title: req.body.title,
                amount: +req.body.amount,
                description: req.body.description
            }).save();

            res.status(201).json(service);
        }

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.updateService = async (req, res) => {
    try {

        if (!req.body.title) {
            return res.status(409).json({errors: 'Название услуги обязательно для заполнения'});
        }

        const candidate = await Services.findOne(
            {$and: [
                {title: req.body.title},
                {_id: {$ne: req.params.id}}
            ]}
        );

        if (candidate) {
            res.status(409).json({errors: 'Услуга с таким названием уже существует.'});
        } else {
            if (+req.body.amount < 0) {
                return res.status(409).json({errors: 'Стоимость не может быть меньше 0.'});
            }

            const service = await Services.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    amount: req.body.amount,
                    description: req.body.description
                }},
                {new: true}
            );

            res.status(200).json(service);
        }


    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.removeService = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}