const httpStatus = require('../../lib/httpStatusCodes.js');
const answers = require('express').Router();

const MulterConfig = require('../../lib/MulterConfig');
const upload = new MulterConfig('answers');

const getAll = require('./getAll');
const getOne = require('./getOne');
const getEmbedLink = require('./getEmbedLink');
const updateAnswer = require('./updateAnswer');

answers.get('/', getAll);
answers.get('/:id', getOne);
answers.get('/file/:id', getEmbedLink);
answers.put('/:id/:rev', upload.single('file'), updateAnswer);

answers.use(function (err, req, res, next) {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
});

module.exports = answers;   
