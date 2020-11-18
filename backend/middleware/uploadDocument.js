const multer = require('multer');
const moment = require('moment');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/documents');
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        const ext = path.extname(file.originalname);
        cb(null, `${date}${ext}`);
        //cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }

}

const limits = {
    fileSize: 1024 * 1024 * 50  // 50Mb
}

module.exports = multer({
    storage,
    fileFilter,
    limits
});