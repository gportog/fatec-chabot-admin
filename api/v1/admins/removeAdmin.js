const DBClient = require('../../lib/DBClient');
const EmailClient = require('../../lib/EmailClient');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    dbInstance.delete(req.params.id, req.params.rev)
        .then(() => {
            let emailMessage = "<body>" +
                "<div>" +
                "<h3>FATEC-JD ADMIN Chatbot</h3>" +
                `<p>Sua conta foi removida da base de dados do dashboard.</p>` +
                `<p>Para solicitar acesso novamente acesse<a href=${process.env.ADMIN_URL + 'registrar'} target="blank"> aqui</a>.</p>` +
                "</div>" +
                "</body>";
            const emailClient = new EmailClient({ to: req.params.id });
            return emailClient.send('Sua conta foi removida do FATEC-JD ADMIN Chatbot', emailMessage)
        })
        .then((resp) => {
            return res.status(httpStatus.OK).json(resp)
        })
        .catch((err) => {
            if (err.message === 'missing' || err.message === 'deleted') {
                err = new Error(errorMessages.DB_DOC_NOT_FOUND(req.params.id));
                err.status = httpStatus.NOT_FOUND;
            } else {
                err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
            }
            return next(err)
        })
};
