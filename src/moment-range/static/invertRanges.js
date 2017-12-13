'use strict';

const mergeRanges = require('./mergeRanges');
const MomentRange = require('../index');

module.exports = invertRanges;

/**
 * Returns the inverse of defined ranges.
 * @param {array} ranges - Array of moment-range objects
 * @returns {array} Array of ranges across all time not defined by
 *    the input array.
 */
function invertRanges(ranges) {
    const result = [];

    // Sort & Combine adjacent ranges
    const inputRanges = mergeRanges(ranges);

    // Establish the universe over all time
    const universe = new MomentRange(null, null);

    // Collect all of the differences between the universe and given ranges
    const diffGroups = [];
    inputRanges.forEach(range => {
        diffGroups.push(universe.subtract(range));
    });

    // Combine the overlapping differences
    diffGroups.forEach((diffGroup, index) => {
        if (index === 0) {
            result.push(...diffGroup);
        }
        else {
            const lastRange = result.slice(-1)[0];
            result.splice(-1, 1, diffGroup[0].intersect(lastRange));

            if (diffGroup[1])
                result.push(diffGroup[1]);
        }
    });

    return result;
}
