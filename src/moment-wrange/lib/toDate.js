'use strict';

module.exports = toDate;

function toDate() {
    return [this.start.toDate(), this.end.toDate()];
}
