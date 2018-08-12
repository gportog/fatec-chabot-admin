const multer  = require('multer');
const httpStatus = require('./httpStatusCodes');
const errorMessages = require('./errorMessages');

const configs = {
    answers: {
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf'){
                let err = new Error(errorMessages.FILE_TYPE_MISMATCH_ERROR('application/pdf', file.mimetype));
                err.status = httpStatus.BAD_REQUEST;
                return cb(err, false);
            }
            return cb(null, true);
        },
        limits: {
            fileSize: 10485760, // 10MB
            files: 1
        }
    }
};

function MulterConfig(type) {
    if (configs[type])
        return multer({
            dest: 'uploads',
            fileFilter: configs[type].fileFilter,
            limits:  configs[type].limits
        });
    throw Error(errorMessages.MULTER_CONFIG_TYPE_NOT_FOUND(type))
}

module.exports = MulterConfig;