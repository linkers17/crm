// Проверка роли

module.exports = roles => (req, res, next) => {
    !roles.includes(req.user.role) ?
        res.status(401).json({errors: 'У вас недостаточно прав доступа'}) :
        next();
};