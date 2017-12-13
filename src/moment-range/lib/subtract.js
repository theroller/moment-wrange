'use strict';

const valueOfRange = require('../static/valueOfRange');

module.exports = subtract;

function subtract(other) {
    const { start, end } = valueOfRange(this);
    const { start: oStart, end: oEnd } = valueOfRange(other);

    if (this.intersect(other) === null) {
        return [this];
    }

    if ((start >= oStart) && (end <= oEnd)) {
        return [];
    }

    if ((start >= oStart) && (start < oEnd) && (end > oEnd)) {
        return [new this.constructor(oEnd, end)];
    }

    if ((start < oStart) && (end > oStart) && (end <= oEnd)) {
        return [new this.constructor(start, oStart)];
    }

    if ((start < oStart) && (end > oEnd)) {
        return [new this.constructor(start, oStart), new this.constructor(oEnd, end)];
    }

    return [];
}
