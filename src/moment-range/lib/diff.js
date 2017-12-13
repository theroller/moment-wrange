'use strict';

module.exports = diff;

function diff(unit, rounded) {
    return this.end.diff(this.start, unit, rounded);
}
