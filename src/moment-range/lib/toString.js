'use strict';

module.exports = toString;

function toString(format) {
    return this.start.format(format) + '/' + this.end.format(format);
}
