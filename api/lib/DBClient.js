const Cloudant = require('@cloudant/cloudant');
const fs = require('fs');

const user = process.env.CLOUDANT_USER;
const pw = process.env.CLOUDANT_PW;

const errorMessages = require('./errorMessages');

function DBClient(db) {
    if (db && typeof db !== 'string')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('db', 'string', typeof db));
    this._db = db || null;
    this._client = Cloudant({ account: user, password: pw });
}

DBClient.prototype.get = function (options) {
    if (typeof options !== 'object')
        options = {
            from: undefined,
            size: undefined
        }
    validateDB(this, options)
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        const database = this._client.db.use(db);
        database.list({ include_docs: true, skip: options.from, limit: options.size },
            function (err, body) {
                if (err) return rej(err);
                return res(body.rows);
            });
    });
}

DBClient.prototype.getById = function (id, options) {
    validateDB(this, options)
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        if (typeof id !== 'string')
            return rej(new Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'string', typeof id)));
        const database = this._client.db.use(db);
        database.get(id, function (err, body) {
            if (err) return rej(err);
            return res(body);
        });
    });
}

DBClient.prototype.getAttachment = function (id, imageName, options) {
    validateDB(this, options)
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        if (typeof id !== 'string')
            return rej(new Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'string', typeof id)));
        const database = this._client.db.use(db);
        database.attachment.get(id, imageName, function (err, body) {
            if (err) return rej(err);
            return res(body);
        });
    });
}

DBClient.prototype.search = function (obj, options) {
    if (!obj || typeof obj !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('Search', 'object', typeof obj))
    if (typeof obj.selector !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('selector_param', 'object', typeof obj.selector))
    if (!obj.fields || obj.fields && !Array.isArray(obj.fields))
        obj.fields = [];
    validateDB(this, options);
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        let database = this._client.db.use(db);
        database.find({
            selector:
                obj.selector,
            fields:
                obj.fields
        }, (err, result) => {
            if (err) return rej(err);
            return res(result.docs);
        })
    })
}

DBClient.prototype.insert = function (doc, options) {
    if (typeof doc !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('doc', 'object', typeof doc));
    validateDB(this, options)
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        const database = this._client.db.use(db);
        database.insert(doc, (err, body, header) => {
            if (err) return rej(err);
            if (body.ok) {
                doc._id = body.id;
                doc._rev = body.rev;
                return res(doc);
            } else return rej(body);
        });
    });
}

DBClient.prototype.insertMultipart = function (doc, file, options) {
    if (typeof doc !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('doc', 'object', typeof doc));
    if (typeof file !== 'object') 
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('file', 'object', typeof file));
    validateDB(this, options);
    const db = this._db || options.db;
    return new Promise((res, rej) => {
        const database = this._client.db.use(db);
        fs.readFile(file.path, (err, data) => {
            if(err) return rej(err);
            if (Object.keys(doc).includes('_attachments')) delete doc._attachments;
            database.multipart.insert(doc, [{
                name: file.originalname,
                data: data,
                content_type: file.mimetype
            }], doc.email, (err, body) => {
                 if(err) return rej(err);
                 if (body.ok) return res(body);
                 else return rej(body);
            });
        });
    });
}

DBClient.prototype.update = function (doc, options) {
    return this.insert(doc, options);
}

DBClient.prototype.updateMultipart = function (doc, file, options) {
    if(!file) return this.insert(doc, options);
    return this.insertMultipart(doc, file, options);
}

DBClient.prototype.delete = function (id, rev, options) {
    if (!id || typeof id !== 'string')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'string', typeof id));
    if (!rev || typeof rev !== 'string')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('rev', 'string', typeof rev));
    validateDB(this, options)
    const db = this._db || options.db;
    const database = this._client.db.use(db);
    return new Promise((res, rej) => {
        database.destroy(id, rev, (err, body) => {
            if (err) return rej(err);
            return res(body);
        })
    });
}

module.exports = DBClient;

// Private functions
function validateDB(instance, options) {
    if (!instance._db) {
        if (!(options && options.db))
            throw new Error(errorMessages.NO_DB_ERROR());
        if (typeof options.db !== 'string')
            throw new Error(errorMessages.TYPE_MISMATCH_ERROR('db', 'string', typeof options.db));
    }
}
