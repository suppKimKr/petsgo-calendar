const Format = require('response-format');
const constants = require('../constants');
const _ = require('lodash');
const util = require('util');
const moment = require('moment-timezone');
const airtable = require('../lib/airtable');
const airtableClient = new airtable.client();

const { mapper } = require('../lib');

const calendarClass = function (params = {}) {};

calendarClass.prototype.constructor = calendarClass;

calendarClass.prototype.getTourEvents = async function (date, type) {
    try {
        const productList = ('after' === type) ?
            await airtableClient.getProductListsAfterStartDate(date)
        : await airtableClient.getProductListsByDate(date);

        return productList;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};
module.exports = calendarClass;
