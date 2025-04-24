const express = require('express');
const inspector = require('schema-inspector');
const { requestCombined, mapper } = require('../lib');
const router = express.Router();
const calendarClass = require('../services/calendarClass');
const _ = require("lodash");
const Format = require("response-format");
const calendarService = new calendarClass();
const objectMapper = require('object-mapper');
const moment = require("moment-timezone");

router.get('/', [requestCombined], async function (req, res) {
    inspector.sanitize(mapper.request.GetCalendarDto, req.combined).data;
    const { date } = req.combined;
    try {
        const lists = await calendarService.getTourEvents(date, 'after');

        const events = objectMapper({ lists }, null, mapper.response.CalendarEventsDto);

        res.render('calendar.ejs', events);
    } catch (e) {
        res.render('error.ejs', { status: Format.internalError().statusCode });
    }
});

router.get('/:date/list', [requestCombined], async function (req, res) {
    inspector.sanitize(mapper.request.GetCalendarDto, req.combined).data;
    try {
        const result = inspector.validate(mapper.request.GetCalendarDto, req.combined);

        if (!result.valid) {
            res.render('error.ejs', { status: Format.notFound().statusCode });
        }
        const { date } = req.combined;

        const lists = await calendarService.getTourEvents(date);

        const momentObj = moment.tz(date, 'YYYY-MM-DD', 'Asia/Seoul');

        function getWeekDates(baseDateStr, timezone = 'Asia/Seoul') {
            const base = moment.tz(baseDateStr, 'YYYY-MM-DD', timezone);
            const startOfWeek = base.clone().startOf('week'); // 일요일 기준

            const labels = ['일', '월', '화', '수', '목', '금', '토'];

            const week = Array.from({ length: 7 }, (_, i) => {
                const mdate = startOfWeek.clone().add(i, 'days');
                return {
                    dayLabel: labels[i],
                    dateStr: mdate.format('D'), // 앞자리 0 없이
                    fullDate: mdate.format('YYYY-MM-DD'),
                    isSelected: mdate.format('YYYY-MM-DD') === baseDateStr,
                };
            });

            return week;
        }

        const weekDates = getWeekDates(date);

        const respObj = {
            monthLabel: `${momentObj.year()}년 ${momentObj.month() + 1}월`,
            schedules: lists,
            weekDates: weekDates,
            nextMonth: momentObj.clone().add(1, 'month').format('YYYY-MM-DD'),
            prevMonth: momentObj.clone().subtract(1, 'month').format('YYYY-MM-DD'),
            nextWeek: momentObj.clone().add(1, 'week').format('YYYY-MM-DD'),
            prevWeek: momentObj.clone().subtract(1, 'week').format('YYYY-MM-DD'),
            nextDay: momentObj.clone().add(1, 'day').format('YYYY-MM-DD'),
        }

        res.render('schedule.ejs', respObj);
    } catch (e) {
        res.render('error.ejs', { status: Format.internalError().statusCode });
    }
});

router.get('/error', [requestCombined], async function (req, res) {
    res.render('error.ejs', { status: Format.internalError().statusCode });
});

module.exports = router;
