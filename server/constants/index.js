module.exports = {
    secret: {
        accessToken: {
            key: 'e041d8fdec689dad193b296fb36ab7becbf0ad6bbd867454d37ef8d312b227d6c6101c4101a4a801f056bbb3c7a9c7513c8c558d83c795a334e13443250fd83a',
            expiresIn: '1h',
            expiresInSec: 60 * 60,
        },
        refreshToken: {
            key: '976668af72f4842e463c83fd926ba291f1838cf35b0beb11240a09cc189c9b12eb0249449bdecb408634a00bd750b8ea5c10a479b1835a3481737fc782ccdac8',
            expiresIn: '7d',
            expiresInSec: 60 * 60 * 24 * 7,
        },
    },
};
