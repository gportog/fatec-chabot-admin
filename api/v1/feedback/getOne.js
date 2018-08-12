const DBClient = require('../../lib/DBClient');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_feedback');
    dbInstance.getById(req.params.id)
        .then((resp) => { return res.status(httpStatus.OK).json(resp) })
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
