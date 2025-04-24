const _ = require('lodash');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const requestIp = require('request-ip');

process.env.NODE_ENV = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'myLocalhost';
global.config = require('config');

module.exports = async (app) => {
    app.use(bodyParser.json({ limit: '50mb' }));

    app.use(
        bodyParser.urlencoded({
            limit: '50mb',
            extended: true,
        })
    );

    app.set('jwt-secret', config.secret);

    app.use(requestIp.mw());

    // CORS 설정
    app.use(cors());
    // app.use(
    //     cors({
    //         origin: ['http://localhost:8080', 'http://localhost:3333'],
    //     })
    // );

    app.use(cookieParser());

    app.use(compression());
    app.use(bearerToken());

    app.disable('etag');
    app.disable('x-powered-by');

    app.set('views', path.join(__dirname, '../server/views'));
    app.set('view engine', 'ejs');

    console.log('---------------------------------------------------------------');
};
