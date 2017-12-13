'use strict';

module.exports = duration;

function duration(unit, rounded) {
    return this.diff(unit, rounded);
}
