const httpStatus = require('../../lib/httpStatusCodes.js');
const admins = require('express').Router();

const errorMessages = require('../../lib/errorMessages');
const MulterConfig = require('../../lib/MulterConfig');
const upload = new MulterConfig('admins');

const getAdminPhoto = require('./getAdminPhoto');
const createAdmin = require('./createAdmin');
const resetPassword = require('./resetPassword');

admins.get('/:id/:image_name', getAdminPhoto);
admins.post('/', upload.single('adminPhoto'), createAdmin);
admins.post('/reset', resetPassword);

admins.use(function (err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        err.message = errorMessages.LIMIT_FILE_SIZE_ERROR(upload.limits.fileSize)
        err.status = httpStatus.BAD_REQUEST;
    }
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
});

module.exports = admins;   
