const nodemailer = require('nodemailer');
const errorMessages = require('./errorMessages');

const gmailUser = process.env.GMAIL_USER;
const gmailPw = process.env.GMAIL_PW;
const adminsMail = process.env.ADMINS_MAIL;

function EmailClient(options) {  
    if (typeof options === "object") {
        const acceptedKeys = Object.keys(this.options);
        Object.keys(options).forEach((val) => {
            if (!acceptedKeys.includes(val)) return delete options[val];
            if (typeof this.options[val] !== typeof options[val]) 
                throw new Error(errorMessages.TYPE_MISMATCH_ERROR(val, typeof this.options[val], typeof options[val]));
        });
        this.options = Object.assign(this.options, options);
    }
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPw
        }
    });
}

EmailClient.prototype.options = {
    from: 'fatecjd_chatbot-no_reply@no_reply.com',
    to: adminsMail,
}

EmailClient.prototype.send = function (emailSubject, emailBody) {
    if (!emailSubject || typeof emailSubject !== 'string')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('subject', 'string', typeof emailSubject));
    if (!emailBody || typeof emailBody !== 'string')
        throw new Error(errorMessages.TYPE_MISMATCH_ERROR('body', 'string', typeof emailBody));
    this.options.subject = emailSubject;
    this.options.html = emailBody;
    return new Promise((res, rej) => {
        this.transporter.sendMail(this.options, (err, body) => {
            if (err) return rej(err);
            return res(body);
        });
    });
}

module.exports = EmailClient;
