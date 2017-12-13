'use strict';

module.exports = valueOf;

function valueOf() {
    return this.end.valueOf() - this.start.valueOf();
}
