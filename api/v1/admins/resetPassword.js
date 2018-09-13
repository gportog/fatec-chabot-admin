const crypto = require('crypto');
const DBClient = require('../../lib/DBClient');
const EmailClient = require('../../lib/EmailClient');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    const email = req.body.email;
    if (typeof email !== 'string') {
        let err = new Error(errorMessages.TYPE_MISMATCH_ERROR('email', 'string', typeof email));
        err.status = httpStatus.BAD_REQUEST;
        throw err;
    }
    let newPassword;
    dbInstance.search({
        selector: {
            email: email
        }
    })
        .then((obj) => {
            if (obj.length !== 1) {
                let err = new Error(errorMessages.DB_DOC_NOT_FOUND(email))
                err.status = httpStatus.NOT_FOUND;
                throw err;
            }
            let admin = obj[0];
            newPassword = crypto.randomBytes(8).toString('hex');
            admin.password = crypto.createHash('md5').update(newPassword).digest('hex');
            return dbInstance.update(admin)
        })
        .then(() => {
                let emailMessage = "<body>" +
                    "<div>" +
                        "<h3>FATEC-JD ADMIN Chatbot</h3>" +
                        `<p>Sua nova senha é <b>${newPassword}</b> .</p>` +
                        `<p>Para voltar ao ADMIN dashboard clique <a href=${process.env.ADMIN_URL} target="blank">aqui</a>.</p>` +
                    "</div>" +
                "</body>";
                const emailClient = new EmailClient({ to: email });
                return emailClient.send(`Nova senha gerada para o/a ${email}`, emailMessage)
        })
        .then((resp) => {
            return res.status(200).json(resp);
        })
        .catch((error) => {
            return next(error);
        })
}
