'use strict';

const valueOfRange = require('../static/valueOfRange');

module.exports = intersect;

function intersect(other) {
    const { start, end } = valueOfRange(this);
    const { start: oStart, end: oEnd } = valueOfRange(other);

    // this          [------------]
    // other {------------------------}
    // int           |============|
    if ((oStart < start) && (oEnd >= end)) {
        return this;
    }

    // this  [------------------------]
    // other         {------------}
    // int           |============|
    if ((start <= oStart) && (end >= oEnd)) {
        return other;
    }

    // this  [------------------------]
    // other                 {------------}
    // int                   |========|
    if ((start <= oStart) && (end > oStart) && (end <= oEnd)) {
        return new this.constructor(oStart, end);
    }

    // this                  [------------]
    // other {------------------------}
    // int                   |========|
    if ((oStart < start) && (oEnd > start) && (oEnd <= end)) {
        return new this.constructor(start, oEnd);
    }

    return null;
}
