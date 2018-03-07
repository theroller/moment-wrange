'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('moment.range()', function() {
    const m1 = moment('2011-04-15', 'YYYY-MM-DD');
    const m2 = moment('2012-12-25', 'YYYY-MM-DD');

    it('range(moment1, moment2) should return a MomentWrange with start & end properties', function() {
        const dr = moment.range(m1, m2);
        expect(moment.isMoment(dr.start)).to.be.true;
        expect(moment.isMoment(dr.end)).to.be.true;
        expect(dr.start.valueOf()).to.equal(m1.valueOf());
        expect(dr.end.valueOf()).to.equal(m2.valueOf());
    });

    it('range("year") produces correct start & end properties', function() {
        const dr = m1.range('year');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('year').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('year').valueOf());
    });

    it('range("month") produces correct start & end properties', function() {
        const dr = m1.range('month');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('month').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('month').valueOf());
    });

    it('range("week") produces correct start & end properties', function() {
        const dr = m1.range('week');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('week').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('week').valueOf());
    });

    it('range("day") produces correct start & end properties', function() {
        const dr = m1.range('day');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('day').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('day').valueOf());
    });

    it('range("hour") produces correct start & end properties', function() {
        const dr = m1.range('hour');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('hour').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('hour').valueOf());
    });

    it('range("minute") produces correct start & end properties', function() {
        const dr = m1.range('minute');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('minute').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('minute').valueOf());
    });

    it('range("second") produces correct start & end properties', function() {
        const dr = m1.range('second');
        expect(dr.start.valueOf()).to.equal(moment(m1).startOf('second').valueOf());
        expect(dr.end.valueOf()).to.equal(moment(m1).endOf('second').valueOf());
    });
});
