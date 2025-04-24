const moment = require('moment-timezone');

module.exports = {
    GetCalendarDto: {
        type: 'object',
        properties: {
            date: {
                type: 'string',
                pattern: /^\d{4}-\d{2}-\d{2}$/,
                rules: ['trim'],
                def: '',
                exec: function (schema, post) {
                    if (post) return post;
                    else return moment.tz('Asia/Seoul').format('YYYY-MM-DD');
                },
            },
        },
    },
    GetSchedulesDto: {
        type: 'object',
        properties: {
            date: {
                type: 'string',
                pattern: /^\d{4}-\d{2}-\d{2}$/,
                rules: ['trim'],
                optional: false,
                def: '',
                exec: function (schema, post) {
                    if (!post) this.report('날짜를 입력해주세요.');
                    else return post;
                },
            },
        },
    },
};
