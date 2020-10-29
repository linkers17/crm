const Users = require('../models/Users');
const findAccess = require('../utils/findAccess');

module.exports.getUserById = async (req, res) => {

    // director -> 5f97c367e890e82ac8c6003f
    // admin -> 5f982c4da87f830668df9bbd
    // manager -> 5f982c84a87f830668df9bbe

    // req.params.body -> id редактируемого пользователя

    const id = req.params.id;
    const user = await Users.findById(id, 'login email surname name role status');  // TODO - статус вывел для изменения и статуса по этому роуту

    if (!user) {
        return res.status(404).json({errors: 'Такого пользователя не существует или он был удален'});
    } else {
        if (!findAccess(req.user.role, user.role)) {
            return res.status(403).json({errors: 'У вас недостаточно прав для просмотра этой страницы'});
        } else {
            return res.status(200).json(user);
        }
    }

};