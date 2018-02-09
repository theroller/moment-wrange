'use strict';

const moment = require('moment');

module.exports = add;

function add(other, options = { adjacent: true }) {
    if (this.overlaps(other, options)) {
        return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
}
