'use strict';

module.exports = isEqual;

function isEqual(other, units) {
    return this.start.isSame(other.start, units) && this.end.isSame(other.end, units);
}
