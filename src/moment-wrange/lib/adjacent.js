'use strict';

module.exports = adjacent;

function adjacent(other, units) {
    return (this.intersect(other) === null) && this.start.isSame(other.end, units) || this.end.isSame(other.start, units);
}
