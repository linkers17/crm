const Services = require('../models/Services');
const errorHandler = require('../utils/errorHandler');

module.exports.getServices = async (req, res) => {
    try {

        

    } catch (err) {
        return errorHandler(res, err);
    }
}

module.exports.getServiceById = async (req, res) => {
    try {

        

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