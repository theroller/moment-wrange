'use strict';

const moment = require('moment');
const MomentRange = require('../index');

module.exports = mergeRanges;

/**
 * Generates a new array of ranges in ascending order where any
 * overlapping or adjacent ranges are merged.
 * @param {array} ranges - Array of moment-range objects
 * @returns {array} Potentially reduced array of ranges
 */
function mergeRanges(ranges) {
    const chunks = [];
    let chunk = null;

    ranges
        .slice() // copy the ranges because we may have to sort them
        .sort((a, b) => a.start - b.start) // ranges must be in ascending order
        .filter(x => !x.start.isSame(x.end)) // remove empty ranges
        .forEach((range, index, array) => {
            if (typeof chunk === 'undefined' || chunk === null) {
                chunk = range;
            }
            else {
                if (range.overlaps(chunk, { adjacent: true })) {
                    chunk = new MomentRange(moment.min(chunk.start, range.start), moment.max(chunk.end, range.end));
                }
                else {
                    chunks.push(chunk);
                    chunk = range;
                }
            }

            // Handle the end of the timeline
            if (index === array.length - 1) {
                chunks.push(chunk);
            }
        });

    return chunks;
}
