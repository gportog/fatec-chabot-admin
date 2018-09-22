const fs = require('fs');
const crypto = require('crypto');

const DBClient = require('../../lib/DBClient');
const httpStatus = require('../../lib/httpStatusCodes');

const errorMessages = require('../../lib/errorMessages');

module.exports = (req, res, next) => {
    const dbInstance = new DBClient('chatbot_admins');
    let master = req.params.id !== req.user._id ? false : req.user.master ? req.user.master : false;
    let password = req.body.newPassword ? crypto.createHash('md5').update(req.body.newPassword).digest('hex') : req.body.password;
    let adminEntry = {
        _id: req.params.id,
        _rev: req.params.rev,
        email: req.body.email,
        password: password,
        master: master,
        active: true,
        user: {
            name: req.body.name,
            surname: req.body.surname
        }
    }
    for (let k in adminEntry) {
        if (adminEntry[k] === 'user') {
            for (let j in adminEntry[k]) {
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

    if (req.file) {
        dbInstance.updateMultipart(adminEntry, req.file)
            .then((resp) => {
                return res.status(httpStatus.OK).json(resp);
            })
            .catch((error) => {
                return next(error);
            })
            .then(() => {
                if (req.file) return deleteFile(req.file.path);
            })
            .catch((err) => { if (err) { console.log(err) } });
    } else {
        dbInstance.getById(adminEntry._id)
            .then((data) => {
                adminEntry._attachments = data._attachments;
                return dbInstance.update(adminEntry)
            })
            .then((resp) => {
                return res.status(httpStatus.OK).json(resp);
            })
            .catch((error) => {
                return next(error);
            })
    }
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
