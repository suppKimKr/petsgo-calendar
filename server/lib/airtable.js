const axios = require('axios');
const jwt = require('jsonwebtoken');
const Airtable = require('airtable');
const _ = require("lodash");

module.exports = {
    client: (function () {
        function client() {
            Airtable.configure({
                endpointUrl: config.airtable.baseURL,
                apiKey: config.airtable.accessKey,
            });

            this.base = Airtable.base(config.airtable.workspace);
        }
        client.prototype.getProductListsAfterStartDate = async function (date) {
            const filter = date ? `AND({Start Date} >= '${date}')` : '';
            try {
                const response = await this.base('petsgo').select({
                    view: 'Grid view',
                    filterByFormula: filter,
                }).firstPage();

                const list = _.map(response, (record) => {
                    const bookRate = _.ceil(record.get('booking') / record.get('maximum'), 2);
                    return {
                        id: record.id,
                        name: record.get('product'),
                        start: record.get('start date'),
                        bookRate,
                    }
                });

                return list;
            } catch (e) {
                console.error(`[getProductListsAfterStartDate] :: ${e.message}`);
                throw new Error(e);
            }
        };
        client.prototype.getProductListsByDate = async function (date) {
            try {
                const response = await this.base('petsgo').select({
                    view: 'Grid view',
                    filterByFormula: `IS_SAME({start Date}, '${date}', 'day')`,
                }).firstPage();

                const list = _.map(response, (record) => {
                    return {
                        id: record.id,
                        title: record.get('product'),
                        start: record.get('start date'),
                        region: record.get('region'),
                        departure: record.get('point of departure'),
                        current: record.get('booking'),
                        max: record.get('maximum'),
                        bookRate: _.ceil(record.get('booking') / record.get('maximum'), 2),
                        url: record.get('link'),
                    }
                });

                return list;
            } catch (e) {
                console.error(`[getProductListsByDate] :: ${e.message}`);
                throw new Error(e);
            }
        };
        return client;
    })(),
};