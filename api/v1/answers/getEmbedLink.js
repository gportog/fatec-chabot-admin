const BOX = require('../../lib/BOX');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const boxInstance = new BOX();
    boxInstance.getPublicLink(parseInt(req.params.id))
        .then((resp) => { return res.status(httpStatus.OK).json(resp) })
        .catch((err) => {           
            if (err.message.search('Not Found')) {
                err = new Error(errorMessages.BOX_FILE_NOT_FOUND(req.params.id));
                err.status = httpStatus.NOT_FOUND;
            } else {
                err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
            }         
            return next(err)
        })
};
