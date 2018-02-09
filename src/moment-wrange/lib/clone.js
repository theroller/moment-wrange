'use strict';

module.exports = clone;

function clone() {
    return new this.constructor(this.start, this.end);
}
