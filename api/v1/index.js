const routes = require('express').Router();
const answers = require('./answers')
const feedback = require('./feedback');

routes.use('/answers', answers);
routes.use('/feedback', feedback);

module.exports = routes;
