'use strict';

const moment = require('moment');
const {
    MIN_TIME_MILLISECONDS,
    MAX_TIME_MILLISECONDS
} = require('../constants');


module.exports = MomentRange;

function MomentRange(start, end) {
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

MomentRange.prototype.adjacent = require('./lib/adjacent');
MomentRange.prototype.add = require('./lib/add');
MomentRange.prototype.by = require('./lib/by');
MomentRange.prototype.byRange = require('./lib/byRange');
MomentRange.prototype.center = require('./lib/center');
MomentRange.prototype.clone = require('./lib/clone');
MomentRange.prototype.contains = require('./lib/contains');
MomentRange.prototype.diff = require('./lib/diff');
MomentRange.prototype.duration = require('./lib/duration');
MomentRange.prototype.intersect = require('./lib/intersect');
MomentRange.prototype.isEqual = require('./lib/isEqual');
MomentRange.prototype.isSame = require('./lib/isSame');
MomentRange.prototype.overlaps = require('./lib/overlaps');
MomentRange.prototype.reverseBy = require('./lib/reverseBy');
MomentRange.prototype.reverseByRange= require('./lib/reverseByRange');
MomentRange.prototype.subtract = require('./lib/subtract');
MomentRange.prototype.toDate = require('./lib/toDate');
MomentRange.prototype.toString = require('./lib/toString');
MomentRange.prototype.valueOf = require('./lib/valueOf');
