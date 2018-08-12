const BoxSDK = require('box-node-sdk');
const errorMessages = require('./errorMessages');

const fs = require('fs');
const path = require('path');

const appRoot = process.env.BOX_ROOT;

function BOX() {
    let sdk = new BoxSDK({
        clientID: process.env.BOX_CLIENT_ID,
        clientSecret: process.env.BOX_CLIENT_SECRET,
        appAuth: {
            keyID: process.env.BOX_PUBLIC_KEY_ID,
            privateKey: process.env.BOX_PRIVATE_KEY,
            passphrase: process.env.BOX_PASSPHRASE
        }
    });
    this._client = sdk.getAppAuthClient('enterprise', process.env.BOX_ENTERPRISE_ID);
}

BOX.prototype.uploadAnswer = function (file) {
    if (typeof file !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('file', 'object', typeof file));
    let stream = fs.createReadStream(file.path);
    return this.getFolderId(appRoot)
        .then((id) => this.getFolderId('upload', id))
        .then((id) => this.upload(`${file.filename}.pdf`, stream, id));
}

BOX.prototype.upload = function (fileName, fileStream, folderId) {
    return new Promise((res, rej) => {
        this._client.files.uploadFile(folderId, fileName, fileStream, (err, resp) => {
            if (err) return rej(err);
            return res(resp.entries[0].id)
        });
    });
}

BOX.prototype.getFolderId = function (folder, parentId) {
    if (!parentId) parentId = 0;
    return new Promise((res, rej) => {
        this._client.folders.getItems(
            parentId,
            { fields: 'name' },
            (err, resp) => {
                if (err) return rej(err);
                for (let i = 0; i < resp.entries.length; i++) {
                    if (resp.entries[i].name === folder)
                        return res(resp.entries[i].id);
                }
                return res('-1');
            }
        );
    })
}

BOX.prototype.getPublicLink = function (id) {
    if (typeof id !== 'number')
        throw Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'number', typeof id))
    return new Promise((res, rej) => {
        this._client.files.getEmbedLink(id)
            .then(embedURL => { return res(embedURL) })
            .catch(err => { return rej(err) })
    })
}

BOX.prototype.updateFile = function (id, file) {
    if (typeof id !== 'number')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'number', typeof id));
    if (typeof file !== 'object')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('file', 'object', typeof file));
    let stream = fs.createReadStream(file.path);
    return new Promise((res, rej) => {
        this._client.files.uploadNewFileVersion(id, stream)
            .then(() => { return res("File " + id + " updated successfully.") })
            .catch((err) => { return rej(err) })
    })
}

BOX.prototype.delete = function (id) {
    if (typeof id !== 'number')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('id', 'number', typeof id));
    return new Promise((res, rej) => {
        this._client.files.delete(id, (err, resp) => {
            if (err) rej(err);
            return res("File " + id + " deleted successfully.");
        });
    })
}

module.exports = BOX;
