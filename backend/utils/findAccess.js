module.exports = (currentUser, findUser) => {
    if (currentUser === 'director') return true;
    if (currentUser === 'admin' && findUser === 'manager') return true;
    return false;
};