const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const requestIp = require('request-ip');

process.env.NODE_ENV = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'myLocalhost';
if('production' !== process.env.NODE_ENV) {
    global.config = require('config');

    process.env.AIRTABLE_ENDPOINT = config.airtable.baseURL;
    process.env.AIRTABLE_ACCESSKEY = config.airtable.accessKey;
    process.env.AIRTABLE_WORKSPACE = config.airtable.workspace;
    process.env.APP_NAME = config.app.name;
    process.env.APP_PORT = config.app.port;
}

module.exports = async (app) => {
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
