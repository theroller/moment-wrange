'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('moment.within()', function() {
    const m1 = moment('2011-04-15', 'YYYY-MM-DD');
    const m2 = moment('2012-12-25', 'YYYY-MM-DD');
    const or1 = moment.range(null, '2011-05-05');
    const or2 = moment.range('2011-03-05', null);

    it('should determine if the current moment is within a given range', function() {
        const dr = m1.range('year');

        expect(m1.within(dr)).to.be.true;
        expect(m2.within(dr)).to.be.false;
        expect(m1.within(or1)).to.be.true;
        expect(m1.within(or2)).to.be.true;
        expect(m2.within(or1)).to.be.false;
        expect(m2.within(or2)).to.be.true;
    });

    it('should consider the edges to be within the range', function() {
        const mStart = moment('2011-03-05', 'YYYY-MM-DD');
        const mEnd = moment('2011-06-05', 'YYYY-MM-DD');
        const dr = moment.range(mStart, mEnd);

        expect(mStart.within(dr)).to.be.true;
        expect(mEnd.within(dr)).to.be.true;
    });
});
