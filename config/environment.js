const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const requestIp = require('request-ip');

process.env.NODE_ENV = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'myLocalhost';
global.config = require('config');

module.exports = (app) => {
    app.use(bodyParser.json({ limit: '50mb' }));

    app.use(
        bodyParser.urlencoded({
            limit: '50mb',
            extended: true,
        })
    );

    app.use(requestIp.mw());

    app.use(compression());

    app.disable('etag');
    app.disable('x-powered-by');

    app.set('views', path.join(__dirname, '../server/views'));
    app.set('view engine', 'ejs');

    console.log('---------------------------------------------------------------');
};
