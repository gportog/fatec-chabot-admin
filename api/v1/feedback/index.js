const httpStatus = require('../../lib/httpStatusCodes.js');
const feedback = require('express').Router();

const getAll = require('./getAll');
const getOne = require('./getOne');

feedback.get('/', getAll);
feedback.get('/:id', getOne);

feedback.use(function (err, req, res, next) {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
});

module.exports = feedback;
