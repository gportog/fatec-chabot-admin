const routes = require('express').Router();
const admins = require('./admins');
const answers = require('./answers');
const feedback = require('./feedback');

routes.use('/admins', admins);
routes.use('/answers', answers);
routes.use('/feedback', feedback);

module.exports = routes;
