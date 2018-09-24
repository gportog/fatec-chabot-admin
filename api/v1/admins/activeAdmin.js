const DBClient = require('../../lib/DBClient');
const EmailClient = require('../../lib/EmailClient');
const httpStatus = require('../../lib/httpStatusCodes');

const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    if (typeof req.body.active !== 'boolean') {
        let err = new Error(errorMessages.TYPE_MISMATCH_ERROR('active', 'boolean', typeof req.body.active));
        err.status = httpStatus.BAD_REQUEST;
        throw err;
    }
    dbInstance.getById(req.params.id)
        .then((data) => {
            data.active = req.body.active;
            return dbInstance.update(data)
        })
        .then(() => {
            let emailMessage = "<body>" +
                "<div>" +
                "<h3>FATEC-JD ADMIN Chatbot</h3>" +
                `<p>Sua conta foi ${req.body.active ? 'ativada' : 'desativada'} da base de dados do dashboard.</p>` +
                `<p>Para ir ao ADMIN dashboard clique<a href=${process.env.ADMIN_URL + 'login'} target="blank"> aqui</a>.</p>` +
                "</div>" +
                "</body>";
            const emailClient = new EmailClient({ to: req.params.id });
            return emailClient.send(`Sua conta do FATEC-JD ADMIN Chatbot foi ${req.body.active ? 'ativada' : 'desativada'}`, emailMessage)
        })
        .then((resp) => {
            return res.status(httpStatus.OK).json(resp);
        })
        .catch((error) => {
            return next(error);
        })
}
