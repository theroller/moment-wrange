'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('contains()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const d3 = new Date(Date.UTC(2011, 4, 9));
    const d4 = new Date(Date.UTC(1988, 0, 1));
    const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
    const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
    const m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
    const m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');

    it('should work with Date objects', function() {
        const dr = moment.range(d1, d2);

        expect(dr.contains(d3)).to.be.true;
        expect(dr.contains(d4)).to.be.false;
    });

    it('should work with Moment objects', function() {
        const dr = moment.range(m1, m2);

        expect(dr.contains(m3)).to.be.true;
        expect(dr.contains(m4)).to.be.false;
    });

    it('should work with MomentWrange objects', function() {
        const dr1 = moment.range(m1, m4);
        const dr2 = moment.range(m3, m2);

        expect(dr1.contains(dr2)).to.be.true;
        expect(dr2.contains(dr1)).to.be.false;
    });

    it('should be an inclusive comparison', function() {
        const dr1 = moment.range(m1, m4);

        expect(dr1.contains(m1)).to.be.true;
        expect(dr1.contains(m4)).to.be.true;
        expect(dr1.contains(dr1)).to.be.true;
    });

    it('should be exclusive when the inclusivity param is set to "()"', function() {
        const dr1 = moment.range(m1, m2);

        expect(dr1.contains(dr1, null, '()')).to.be.false;
        expect(dr1.contains(dr1, null, '[]')).to.be.true;
        expect(dr1.contains(dr1)).to.be.true;
        expect(dr1.contains(m2, null, '()')).to.be.false;
        expect(dr1.contains(m2, null, '[]')).to.be.true;
        expect(dr1.contains(m2)).to.be.true;
    });

    it('should apply units in comparison', function() {
        const my1 = moment('2000-06-15T12:00:00.000Z');
        const my2 = moment('2010-06-15T12:00:00.000Z');
        const dr1 = moment.range(my1, my2);
        const my1H1 = my1.clone().subtract(1, 'hour');
        const my1D1 = my1.clone().subtract(1, 'day');
        const my1M1 = my1.clone().subtract(1, 'month');
        const my2H1 = my2.clone().add(1, 'hour');
        const my2D1 = my2.clone().add(1, 'day');
        const my2M1 = my2.clone().add(1, 'month');

        expect(dr1.contains(my1H1)).to.be.false;
        expect(dr1.contains(my1H1, 'day')).to.be.true;
        expect(dr1.contains(my1D1)).to.be.false;
        expect(dr1.contains(my1D1, 'month')).to.be.true;
        expect(dr1.contains(my1M1)).to.be.false;
        expect(dr1.contains(my1M1, 'year')).to.be.true;

        expect(dr1.contains(my2H1)).to.be.false;
        expect(dr1.contains(my2H1, 'day')).to.be.true;
        expect(dr1.contains(my2D1)).to.be.false;
        expect(dr1.contains(my2D1, 'month')).to.be.true;
        expect(dr1.contains(my2M1)).to.be.false;
        expect(dr1.contains(my2M1, 'year')).to.be.true;
    });
});
