const httpStatus = require('../../lib/httpStatusCodes.js');
const answers = require('express').Router();

const MulterConfig = require('../../lib/MulterConfig');
const upload = new MulterConfig('answers');

const getAll = require('./getAll');
const getOne = require('./getOne');
const updateAnswer = require('./updateAnswer');

answers.get('/', getAll);
answers.get('/:id', getOne);
answers.put('/:id/:rev', upload.single('file'), updateAnswer);

answers.use(function (err, req, res, next) {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
});

module.exports = answers;   
