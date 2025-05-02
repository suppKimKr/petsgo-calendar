const _ = require('lodash');
module.exports.mapper = require('../lib/mapper');

const requestCombined = function (req, res, next) {
    console.info(`[${req.method}][${req.originalUrl}][${req.clientIp}]`);

    try {
        let _combinedReq_ = _.assign({}, req.query, req.params, req.body, { user: res.user || req.user }, { ip: req.clientIp });

        req.combined = _combinedReq_;

        next();
    } catch (e) {
        console.error(e);
    }
};
module.exports.requestCombined = requestCombined;