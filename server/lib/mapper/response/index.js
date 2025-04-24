const _ = require("lodash");
module.exports = {
    CalendarEventsDto: {
        lists: [
            {
                key: 'events?',
                transform: function (value) {
                    const _return_ = _.chain(value)
                        .groupBy('start')
                        .map((group, key) => {
                            return {
                                start: key,
                                display: 'list-item',
                                title: '',
                                extendedProps: {
                                    dotGroup: _.chain(group)
                                        .orderBy(['bookRate'], ['desc'])
                                        .map(el => _.assign({}, { bookRate: el.bookRate, color: (el.bookRate >= 0.7) ? 'blue' : (el.bookRate < 0.5) ? 'gray' : 'green' }))
                                        .uniqBy('color')
                                        .value()
                                }
                            }
                        })
                        .flatten()
                        .value();

                    return _return_;
                },
            },
        ],
    },
};
