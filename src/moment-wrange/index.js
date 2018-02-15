'use strict';

const moment = require('moment');
const {
    MIN_TIME_MILLISECONDS,
    MAX_TIME_MILLISECONDS
} = require('../constants');


module.exports = MomentWrange;

function MomentWrange(start, end) {
    let s = start;
    let e = end;

    if (arguments.length === 1 || end === undefined) {
        if (typeof start === 'object' && start.length === 2) {
            [s, e] = start;
        }
        else if (typeof start === 'string') {
            [s, e] = start.split('/');
        }
    }

    this.start = (s === null) ? moment(MIN_TIME_MILLISECONDS) : moment(s);
    this.end = (e === null) ? moment(MAX_TIME_MILLISECONDS) : moment(e);

    if (this.start.isAfter(this.end))
        throw new Error('start must preceed end');
}

MomentWrange.prototype.adjacent = require('./lib/adjacent');
MomentWrange.prototype.add = require('./lib/add');
MomentWrange.prototype.by = require('./lib/by');
MomentWrange.prototype.byRange = require('./lib/byRange');
MomentWrange.prototype.center = require('./lib/center');
MomentWrange.prototype.clone = require('./lib/clone');
MomentWrange.prototype.contains = require('./lib/contains');
MomentWrange.prototype.diff = require('./lib/diff');
MomentWrange.prototype.duration = require('./lib/duration');
MomentWrange.prototype.intersect = require('./lib/intersect');
MomentWrange.prototype.isEqual = require('./lib/isEqual');
MomentWrange.prototype.isSame = require('./lib/isSame');
MomentWrange.prototype.overlaps = require('./lib/overlaps');
MomentWrange.prototype.reverseBy = require('./lib/reverseBy');
MomentWrange.prototype.reverseByRange= require('./lib/reverseByRange');
MomentWrange.prototype.subtract = require('./lib/subtract');
MomentWrange.prototype.toDate = require('./lib/toDate');
MomentWrange.prototype.toString = require('./lib/toString');
MomentWrange.prototype.valueOf = require('./lib/valueOf');
