'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('constructor', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
    const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
    const sStart = '1996-08-12T00:00:00.000Z';
    const sEnd = '2012-01-01T00:00:00.000Z';

    it('should allow initialization with date string', function() {
        const dr = moment.range(sStart, sEnd);

        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization with Date object', function() {
        const dr = moment.range(d1, d2);

        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization with Moment object', function() {
        const dr = moment.range(m1, m2);

        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization with an ISO 8601 Time Interval string', function() {
        const start = '2015-01-17T09:50:04+00:00';
        const end   = '2015-04-17T08:29:55+00:00';
        const dr = moment.range(start + '/' + end);

        expect(moment.utc(start).isSame(dr.start)).to.be.true;
        expect(moment.utc(end).isSame(dr.end)).to.be.true;
    });

    it('should allow initialization with an array', function() {
        const dr = moment.range([m1, m2]);

        expect(m1.isSame(dr.start)).to.be.true;
        expect(m2.isSame(dr.end)).to.be.true;
    });

    it('should allow initialization with open-ended ranges', function() {
        let dr = moment.range(null, m1);

        expect(moment.isMoment(dr.start)).to.be.true;

        dr = moment.range(m1, null);

        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization without any arguments', function() {
        const dr = moment.range();

        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization with undefined arguments', function() {
        const dr = moment.range(undefined, undefined);

        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
    });

    it('should allow initialization with moment interval strings', function() {
        const date = moment('2016-12-12T11:12:18.607');
        const quarterStart = moment('2016-10-01T00:00:00.000');
        const quarterEnd = moment('2016-12-31T23:59:59.999');
        const r = date.range('quarter');

        expect(r.start.isSame(quarterStart)).to.be.true;
        expect(r.end.isSame(quarterEnd)).to.be.true;
    });
});
