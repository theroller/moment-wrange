'use strict';

const moment = require('moment');

module.exports = center;

function center() {
    return moment(this.start.valueOf() + this.diff() / 2);
}
