const Role = require('../models/Roles');
const errorHandler = require('../utils/errorHandler');

module.exports.getRoles = async (req, res) => {

    const roles = await Role.find({}, (err, data) => {
        if (err) return errorHandler(res, err);
    });

    res.status(200).json(roles);
};

module.exports.addRole = (req, res) => {
    const role = new Role({
        name: req.body.name
    });

    role.save()
        .then(() => res.status(201).json(role))
        .catch((e) => errorHandler(res, e));
};
