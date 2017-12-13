'use strict';

const INTERVALS = {
    year: true,
    quarter: true,
    month: true,
    week: true,
    day: true,
    hour: true,
    minute: true,
    second: true
};

Object.defineProperties(module.exports, {
    INTERVALS: { value: INTERVALS, enumerable: true },
    MAX_TIME_MILLISECONDS: { value: 8640000000000000, enumerable: true },
    MIN_TIME_MILLISECONDS: { value: -8640000000000000, enumerable: true }
});
