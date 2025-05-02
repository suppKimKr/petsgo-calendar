const express = require('express');

const environment = require('./config/environment');
const route = require('./config/routes');
const Format = require("response-format");

const server = express();

environment(server);
route(server);

server.use('/public', express.static('server/views'));

server.use(function (req, res) {
    res.render('error.ejs', { status: Format.notFound().statusCode });
});

server.listen(process.env.APP_PORT, function () {
    console.log('[%s][%s] (http) listening on port [%s]', process.env.NODE_ENV, process.env.APP_NAME, this.address().port);
    console.log('---------------------------------------------------------------');
});

module.exports = server;
