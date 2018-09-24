const httpStatus = require('../../lib/httpStatusCodes.js');
const admins = require('express').Router();

const errorMessages = require('../../lib/errorMessages');
const MulterConfig = require('../../lib/MulterConfig');
const upload = new MulterConfig('admins');

const getAll = require('./getAll');
const getOne = require('./getOne');
const getAdminPhoto = require('./getAdminPhoto');
const resetPassword = require('./resetPassword');
const createAdmin = require('./createAdmin');
const activeAdmin = require('./activeAdmin');
const updateAdmin = require('./updateAdmin');
const removeAdmin = require('./removeAdmin');

admins.get('/', controlAccess, getAll);
admins.get('/:id', controlAccess, getOne);
admins.get('/:id/:image_name', controlAccess, getAdminPhoto);
admins.post('/reset', resetPassword);
admins.post('/', upload.single('adminPhoto'), createAdmin);
admins.put('/active/:id', controlAccess, activeAdmin);
admins.put('/:id/:rev', controlAccess, upload.single('adminPhoto'), updateAdmin);
admins.delete('/:id/:rev', controlAccess, removeAdmin);

admins.use(function (err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        err.message = errorMessages.LIMIT_FILE_SIZE_ERROR(upload.limits.fileSize)
        err.status = httpStatus.BAD_REQUEST;
    }
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
});

module.exports = admins;   

function controlAccess(req, res, next) {
    if (req.user.master) return next();
    if (req.user.active && req.user._id === req.params.id) return next();
    return res.status(httpStatus.UNAUTHORIZED)
        .json({ message: 'You are not allowed to perform this action' });
}
