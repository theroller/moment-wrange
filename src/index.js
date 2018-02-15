'use strict';

const moment = require('moment');
const MomentWrange = require('./moment-wrange');
const {
    INTERVALS,
    MIN_TIME_MILLISECONDS,
    MAX_TIME_MILLISECONDS
} = require('./constants');


// Static Methods
const invertRanges = require('./moment-wrange/static/invertRanges');
const isRange = require('./moment-wrange/static/isRange');
const mergeRanges = require('./moment-wrange/static/mergeRanges');

module.exports.extendMoment = extendMoment;
module.exports.MAX_MOMENT = moment(MAX_TIME_MILLISECONDS);
module.exports.MIN_MOMENT = moment(MIN_TIME_MILLISECONDS);


function extendMoment(moment) {
    moment.range = function range(start, end) {
        const m = this;

        if (INTERVALS.hasOwnProperty(start)) {
            return new MomentWrange(moment(m).startOf(start), moment(m).endOf(start));
        }

        return new MomentWrange(start, end);
    };

    /**
    * Alias of static constructor.
    */
    moment.fn.range = moment.range;

    /**
    * Expose constructor
    */
    moment.range.constructor = MomentWrange;

    /**
     * Static Methods
     */
    moment.isRange = moment.fn.isRange = isRange;
    moment.invertRanges = moment.fn.invertRanges = invertRanges;
    moment.mergeRanges = moment.fn.mergeRanges = mergeRanges;

    /**
    * Check if the current moment is within a given date range.
    */
    moment.fn.within = function within(range) {
        return range.contains(this.toDate());
    };

    return moment;
}
