module.exports = (res, error) => {
    res.status(500).json({
        errors: error.message ? error.message : error
    });
};
