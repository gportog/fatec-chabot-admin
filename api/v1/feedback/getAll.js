const DBClient = require('../../lib/DBClient');
const httpStatus = require('../../lib/httpStatusCodes');

const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_feedback');
    dbInstance.get()
        .then((resp) => {
            let respClient = [];
            resp.forEach(e => {
                respClient.push(e.doc);                
            });
            return res.status(httpStatus.OK).json(respClient);
        })
        .catch((error) => {
            console.log(error.stack);
            let err = new Error(errorMessages.DB_CONNECT_ERROR());
            return next(err)
        })
}
