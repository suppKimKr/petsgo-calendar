const apiVersion = `/v1`;

const controllers = require('../server/controllers');

module.exports = (app) => {
    console.log('Initializing routes.');

    console.log(`${apiVersion}/service`);
    app.use(`${apiVersion}/service`, controllers.calendar);

    console.log('\r');
};
