const express = require('express');

const environment = require('./config/environment');
const route = require('./config/routes');
const Format = require("response-format");

(async () => {
    const server = express();

    await environment(server);
    route(server);

    server.use('/public', express.static('server/views/img'));

    server.use(function (req, res, next) {
        res.render('error.ejs', { status: Format.notFound().statusCode });
    });

    server.listen(config.app.port, function () {
        console.log('[%s][%s] (http) listening on port [%s]', global.config.app.env, global.config.app.name, this.address().port);
        console.log('---------------------------------------------------------------');
    });
})();
