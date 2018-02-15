'use strict';

const MomentWrange = require('../index');
const valueOfRange = require('../static/valueOfRange');

module.exports = contains;

function contains(other, units, inclusivity) {
    // Default to inclusive
    inclusivity = inclusivity || '[]';

    const { start, end } = valueOfRange(this, units);

    let oStart;
    let oEnd;

    if (other instanceof MomentWrange) {
        oStart = other.start.valueOf();
        oEnd = other.end.valueOf();
    }
    else {
        oStart = other.valueOf();
        oEnd = other.valueOf();
    }

    const startInRange = (inclusivity[0] === '[') ? start <= oStart : start < oStart;
    const endInRange = (inclusivity[1] === ']') ? end >= oEnd : end > oEnd;

    return (startInRange && endInRange);
}
