'use strict';

const moment = require('moment');

module.exports = valueOfRange;

function valueOfRange(range, units='millisecond') {
    units = moment.normalizeUnits(units);

    let start;
    let end;

    if (units === 'millisecond') {
        start = range.start.valueOf();
        end = range.end.valueOf();
    }
    else {
        start = range.start.clone().startOf(units).valueOf();
        end = range.end.clone().endOf(units).valueOf();
    }

    return { start, end };
}
