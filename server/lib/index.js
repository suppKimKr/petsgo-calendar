const jwt = require('jsonwebtoken');
const Format = require('response-format');
const _ = require('lodash');
const constants = require('../constants');
const moment = require('moment-timezone');

const signJWT = function (_param_, _secret_, _expires_, _header_) {
    try {
        let token = jwt.sign(_param_, _secret_, {
            expiresIn: _expires_,
            header: _header_,
        });

        return token;
    } catch (e) {
        throw new Error(e);
    }
};
module.exports.signJWT = signJWT;

const decodeToken = function (token) {
    try {
        return jwt.decode(token);
    } catch (e) {
        next();
    }
};
module.exports.decodeToken = decodeToken;

const validAny = async function (req, res, next) {
    try {
        jwt.verify(req.token, constants.secret.accessToken.key, async function (err, decoded) {
            if (!!err) {
                res.user = null;
            } else {
                res.user = decoded;
            }
            next();
        });
    } catch (e) {
        next();
    }
};
module.exports.validAny = validAny;

const validApiToken = async function (req, res, next) {
    try {
        jwt.verify(req.token, constants.secret.accessToken.key, async function (err, decoded) {
            if (!!err) {
                console.error(`[validApiToken:::error] ${req.originalUrl}`);
                res.status(401).json(Format.unAuthorized());
                return;
            } else {
                res.user = decoded;
                next();
            }
        });
    } catch (e) {
        res.json(Format.unAuthorized(e.message));
        return;
    }
};
module.exports.validApiToken = validApiToken;

const validRefreshToken = async function (req, res, next) {
    try {
        jwt.verify(req.body.refreshToken, constants.secret.refreshToken.key, async function (err, decoded) {
            if (!!err) {
                console.error(`[validRefreshToken:::error] ${req.originalUrl}`);
                res.status(401).json(Format.unAuthorized());
                return;
            } else {
                res.refreshed = decoded;
                next();
            }
        });
    } catch (e) {
        res.json(Format.unAuthorized(e.message));
        return;
    }
};
module.exports.validRefreshToken = validRefreshToken;

const randomNum = function () {
    try {
        let value = '';
        for (let i = 0; i < 6; i++) {
            value += parseInt(Math.random() * 10, 10);
        }
        return value;
    } catch (e) {
        console.error(e);
        return;
    }
};
module.exports.randomNum = randomNum;

const requestCombined = function (req, res, next) {
    console.info(`[${req.method}][${req.originalUrl}][${req.clientIp}]`);

    try {
        let _combinedReq_ = _.assign({}, req.query, req.params, req.body, { user: res.user || req.user }, { ip: req.clientIp });

        req.combined = _combinedReq_;

        next();
    } catch (e) {
        console.error(e);
        return;
    }
};
module.exports.requestCombined = requestCombined;

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
module.exports.sleep = sleep;

const GetValue = function (plaindata, key) {
    var arrData = plaindata.split(':');
    var value = '';
    for (i in arrData) {
        var item = arrData[i];
        if (item.indexOf(key) == 0) {
            var valLen = parseInt(item.replace(key, ''));
            arrData[i++];
            value = arrData[i].substr(0, valLen);
            break;
        }
    }
    return value;
};
module.exports.GetValue = GetValue;

const getFilePathFromFields = function (fields, objArray) {
    if (objArray.length) {
        let resultArr = _.assign(objArray);
        return resultArr.map((result) => {
            fields.forEach((field) => {
                function recursion(target, field) {
                    const fieldArr = field.split('.');
                    const depth = fieldArr.length;
                    if (depth > 1) {
                        recursion(result[fieldArr[0]], fieldArr.splice(1, depth).toString());
                    }
                    target[field] = `${constants.imagePathPrefix.s3}${target[field]}`;
                }
                recursion(result, field);
            });
            return result;
        });
    } else return objArray;
};
module.exports.getFilePathFromFields = getFilePathFromFields;

module.exports.mapper = require('../lib/mapper');

const sendToBatch = function (channel, command) {
    //console.log(command);
    console.log(channel);
    redisClient.publish(channel, JSON.stringify(command));
};
module.exports.sendToBatch = sendToBatch;

const productHashToArray = function (hash) {
    const ids = hashids.decode(hash);

    return ids;
};
module.exports.productHashToArray = productHashToArray;

const arrayToProductHash = function (options) {
    const hash = hashids.encode(options);

    return hash;
};
module.exports.arrayToProductHash = arrayToProductHash;

const generateNewMemo = function (status, statusToBe, workUser) {
    const newMemo = {
        contents: `상태변경: [ ${constants.orderStatus[status]} ] -> [ ${constants.orderStatus[statusToBe]} ]`,
        workUser: _.isNil(workUser) ? 'system' : workUser,
        createdAt: moment().add(9, 'h').format('YYYY-MM-DD HH:mm:ss'),
    };

    return newMemo;
};
module.exports.generateNewMemo = generateNewMemo;

const pickProduct = function (options) {
    if (_.isNil(options) || 0 === _.size(options)) {
        return null;
    }

    const filteredOptions = _.filter(options, function (o) {
        return 0 < o.stock;
    });

    if (!_.size(filteredOptions)) {
        return null;
    }

    const minPrice = _.sortBy(filteredOptions, ['price'])[0].price;

    const picked = _.chain(filteredOptions)
        .filter({ price: minPrice })
        .orderBy([(o) => o.seller.sort, (o) => o.seller.createdAt], ['asc', 'asc'])
        .value();
    return !_.size(picked) ? null : picked[0];
};
module.exports.pickProduct = pickProduct;

const pickGoodDeal= function (priceOptions) {
    const havingStockOptions = _.compact(priceOptions);

    switch (_.size(havingStockOptions)) {
        case 2:
        case 3:
            const minPrice = _.minBy(havingStockOptions, 'price');
            const minPriceIndex = _.findLastIndex(havingStockOptions, { price: minPrice.price });

            if (minPriceIndex > 0) {
                return havingStockOptions[minPriceIndex].grade;
            }
            return null;
        default:
            return null;
    }
}
module.exports.pickGoodDeal = pickGoodDeal;

const pickProductWithNoneStock = function (options) {
    if (_.isNil(options) || 0 === _.size(options)) {
        return null;
    }

    const groupedP = _.groupBy(options, 'price');
    const priceArray = _.chain(groupedP)
        .keys()
        .flatMap((o) => parseInt(o))
        .sortBy()
        .value();

    let tmp = [];

    const minPrice = _.sortBy(options, ['price'])[0].price;

    const picked = _.chain(options)
        .filter({ price: minPrice })
        .orderBy([(o) => o.seller.sort, (o) => o.seller.createdAt], ['asc', 'asc'])
        .value();

    if (0 === picked[0].stock) {
        _.forEach(priceArray, function (o) {
            const a = _.chain(options)
                .filter({ price: o })
                .orderBy([(o) => o.seller.sort, (o) => o.seller.createdAt], ['asc', 'asc'])
                .value();

            if (0 < a.length) {
                _.forEach(a, function (v) {
                    if (0 < v.stock) {
                        tmp.push(v);
                        return;
                    }
                });
            }
        });
    } else {
        tmp.push(picked[0]);
    }

    return !!_.size(tmp) ? tmp[0] : picked[0];
};
module.exports.pickProductWithNoneStock = pickProductWithNoneStock;

const trimAndLowerSearchKeyword = function (str) {
    console.log('searched:::::::', str);

    const _keyword_ = _.chain(str)
        .trim()
        .lowerCase()
        .replace(/ /g, '')
        .value();

    return _keyword_;
};
module.exports.trimAndLowerSearchKeyword = trimAndLowerSearchKeyword;

const isForbiddenWords = function (inputText) {
    const splitMsg = _.split(inputText, ' ');

    const badWords = _.chain(require('../../data/forbidden_words.json'))
        .map('word')
        .value();

    for (const badWord of badWords) {
        if (_.includes(splitMsg, badWord)) {
            return true;
        }
    }

    return false;
};
module.exports.isForbiddenWords = isForbiddenWords;

const replaceAllForbiddenWords = function (inputText) {

    let cleansedText = null;
    if (!_.isNil(inputText)) {
        const forbiddenWordObj = _.chain(require('../../data/forbidden_words.json'))
            .keyBy('word')
            .mapValues('cleansed')
            .value();

        const forbiddenWordArr = _.keys(forbiddenWordObj);

        _.forEach(forbiddenWordArr, (badWord) => {
            const re = new RegExp(badWord, "g");
            inputText = inputText.replace(re, forbiddenWordObj[badWord]);
        });

        cleansedText = inputText;
    }

    return cleansedText;
};
module.exports.replaceAllForbiddenWords = replaceAllForbiddenWords;

const camelize = function (obj) {
    return _.transform(obj, (acc, value, key, target) => {
        const camelKey = _.isArray(target) ? key : _.camelCase(key);

        acc[camelKey] = _.isObject(value) ? camelize(value) : value;
    });
}
module.exports.camelize = camelize;

const createDefaultObject = function (schema, hashKey) {
    const obj = {};

    for (let [key, options] of Object.entries(schema)) {
        if (options.type === Object && options.schema) {
            obj[key] = createDefaultObject(options.schema);  // 재귀적으로 내부 스키마 탐색
        } else if (options.hashKey) {
            obj[key] = hashKey;
        } else if (options.default !== undefined) {
            obj[key] = options.default;
        }
    }
    return obj;
}
module.exports.createDefaultObject = createDefaultObject;