'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('toString()', function() {

    it('should be a correctly formatted ISO8601 Time Interval', function() {
        const start = moment.utc('2015-01-17T09:50:04+00:00');
        const end   = moment.utc('2015-04-17T08:29:55+00:00');
        const dr = moment.range(start, end);

        expect(dr.toString()).to.equal(start.format() + '/' + end.format());
    });
});
