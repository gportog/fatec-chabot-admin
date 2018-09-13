const DBClient = require('../../lib/DBClient');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    dbInstance.getAttachment(req.params.id, req.params.image_name)
        .then((resp) => { 
            res.contentType('image/png');
            return res.end(resp, 'binary');
        })
        .catch((err) => {
            if (err.message === 'missing') {
                err = new Error(errorMessages.DB_DOC_NOT_FOUND(req.params.id));
                err.status = httpStatus.NOT_FOUND;
            } else {
                err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
            }
            return next(err)
        })
};
