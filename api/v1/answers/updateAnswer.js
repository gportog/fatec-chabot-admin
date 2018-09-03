const DBClient = require('../../lib/DBClient');
const BOX = require('../../lib/BOX');
const httpStatus = require('../../lib/httpStatusCodes');
const errorMessages = require('../../lib/errorMessages');

const fs = require('fs');

module.exports = (req, res, next) => {
    if (typeof req.body.answer !== 'string') {
        let err = new Error(errorMessages.TYPE_MISMATCH_ERROR('answer', 'string', typeof req.body.answer));
        err.status = httpStatus.BAD_REQUEST;
        return next(err)
    }
    let entitiesEntry = [];
    if (req.body.entity && req.body.entity.length > 0) {
        for (let i = 0; i < req.body.entity.length; i++) {
            entitiesEntry.push({
                entity: req.body.entity[i],
                value: req.body.value[i]
            })
        }
    }
    let answerEntry = {
        _id: req.params.id,
        _rev: req.params.rev,
        intent: req.body.intent || '',
        entities: entitiesEntry,
        answer: req.body.answer,
        file: parseInt(req.body.file) || null
    }
    let fileStatus = req.body.fileStatus;
    let dbClient = new DBClient('chatbot_answers');
    let boxInstance = new BOX();
    if (fileStatus === 'new') {
        return boxInstance.uploadAnswer(req.file)
            .then((id) => {
                answerEntry.file = parseInt(id);
                return deleteFile(req.file.path);
            })
            .then(() => { return dbClient.update(answerEntry) })
            .then((dbEntry) => { return res.status(httpStatus.OK_CREATED).send(dbEntry) })
            .catch((err) => {
                if (err.message === 'Document update conflict.' || err.message === 'Invalid rev format') {
                    err = new Error(errorMessages.DB_DOC_INVALID_REV(req.params.server_id));
                    err.status = httpStatus.BAD_REQUEST;
                } else {
                    err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
                }
                return next(err);
            });
    }
    else if (fileStatus === 'update') {
        return boxInstance.updateFile(answerEntry.file, req.file)
            .then(() => { return deleteFile(req.file.path) })
            .then(() => { return dbClient.update(answerEntry) })
            .then((dbEntry) => { return res.status(httpStatus.OK_CREATED).send(dbEntry) })
            .catch((err) => {
                if (err.message === 'Document update conflict.' || err.message === 'Invalid rev format') {
                    err = new Error(errorMessages.DB_DOC_INVALID_REV(req.params.server_id));
                    err.status = httpStatus.BAD_REQUEST;
                } else {
                    err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
                }
                return next(err);
            });
    }
    else if (fileStatus === 'delete') {
        return boxInstance.delete(answerEntry.file)
            .then(() => {
                answerEntry.file = null;
                return dbClient.update(answerEntry);
            })
            .then((dbEntry) => { return res.status(httpStatus.OK_CREATED).send(dbEntry) })
            .catch((err) => {
                if (err.message === 'Document update conflict.' || err.message === 'Invalid rev format') {
                    err = new Error(errorMessages.DB_DOC_INVALID_REV(req.params.server_id));
                    err.status = httpStatus.BAD_REQUEST;
                } else {
                    err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
                }
                return next(err);
            });
    }
    else {
        return dbClient.update(answerEntry)
            .then((dbEntry) => { return res.status(httpStatus.OK_CREATED).send(dbEntry) })
            .catch((err) => {
                if (err.message === 'Document update conflict.' || err.message === 'Invalid rev format') {
                    err = new Error(errorMessages.DB_DOC_INVALID_REV(req.params.server_id));
                    err.status = httpStatus.BAD_REQUEST;
                } else {
                    err = new Error(errorMessages.INTERNAL_SERVER_ERROR());
                }
                return next(err);
            });
    }
};

function deleteFile(path) {
    return new Promise((res, rej) => {
        fs.unlink(path, err => {
            if (err) {
                return rej(new Error(errorMessages.IO_ERROR(path)));
            }
            return res();
        })
    });
}
