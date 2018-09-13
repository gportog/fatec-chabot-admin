const fs = require('fs');
const crypto = require('crypto');
const DBClient = require('../../lib/DBClient');
const EmailClient = require('../../lib/EmailClient');
const httpStatus = require('../../lib/httpStatusCodes');

const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    let adminEntry = {
        email: req.body.email,
        password: req.body.password,
        master: false,
        active: false,
        user: {
            name: req.body.name,
            surname: req.body.surname
        }
    }
    for (let k in adminEntry) {
        if (adminEntry[k] === 'user') {
            for(let j in adminEntry[k]) {
                 if (typeof adminEntry.user[j] === 'undefined' || adminEntry.user[j] === '') {
                     let err = new Error(errorMessages.MISSING_FIELD_ERROR(j));
                     err.status = httpStatus.BAD_REQUEST;
                     throw err;
                 }
            }
        }
        else if (typeof adminEntry[k] === 'undefined' || adminEntry[k] === '') {
            let err = new Error(errorMessages.MISSING_FIELD_ERROR(k));
            err.status = httpStatus.BAD_REQUEST;
            throw err;
        }
    }  
    dbInstance.search({
        selector: {
            email: req.body.email
        }
    })
       .then((obj) => {
            if (obj.length !== 0) {
                let err = new Error(errorMessages.DB_DOC_DATA_CONFLICT())
                err.status = httpStatus.BAD_REQUEST;
                next(err)
                return deleteFile(req.file.path)
                        .catch((err) => { if(err){ console.log(err) } });
            } else {
                    adminEntry.password = crypto.createHash('md5').update(adminEntry.password).digest('hex');
                    return dbInstance.insertMultipart(adminEntry, req.file)
                        .then(() => {
                            let emailMessage = "<body>" +
                               "<div>" +
                                 "<h3>FATEC-JD ADMIN Chatbot</h3>" +
                                    `<p><b>${adminEntry.email}</b> solicitou acesso ao dashboard de administração do chatbot.</p>` +
                                    `<p>Para aprovar a solicitação clique <a href=${process.env.ADMIN_URL} target="blank">aqui</a>.</p>` +
                               "</div>" +
                               "</body>";
                                const emailClient = new EmailClient();
                                return emailClient.send(`${adminEntry.email} solicitou acesso ao FATEC-JD ADMIN Chatbot`, emailMessage)
                        })
                        .then((resp) => {
                            return res.status(httpStatus.OK).json(resp);
                        })
                        .catch((error) => {
                            return next(error);
                        })
                        .then(() => {
                            return deleteFile(req.file.path);
                        })
                        .catch((err) => { if(err){ console.log(err) } });
            }
       })
}

function deleteFile(path) {
    return new Promise((res, rej) => {
        fs.unlink(path, err => {
            if (err) {
                console.log(err.stack);
                return rej(new Error(errorMessages.IO_ERROR(path)));
            }
            return res();
        })
    });
}
