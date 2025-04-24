const apiVersion = `/v1/service`;

const controllers = require('../server/controllers');

module.exports = (app) => {
    console.log('Initializing routes.');

    console.log(`${apiVersion}/calendar`);
    app.use(`${apiVersion}/calendar`, controllers.calendar);

    console.log('\r');
};
