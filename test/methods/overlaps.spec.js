'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('overlaps()', function() {
    const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
    const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
    const m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
    const m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');

    it('should work with MomentWrange objects', function() {
        const dr1 = moment.range(m1, m2);
        const dr2 = moment.range(m3, m4);
        const dr3 = moment.range(m2, m4);
        const dr4 = moment.range(m1, m3);

        expect(dr1.overlaps(dr2)).to.be.true;
        expect(dr1.overlaps(dr3)).to.be.false;
        expect(dr4.overlaps(dr3)).to.be.false;
    });

    it('should indicate if ranges overlap if the options is passed in', function() {
        const a = moment('15-Mar-2016', 'D-MMM-YYYY');
        const b = moment('20-Mar-2016', 'D-MMM-YYYY');
        const c = moment('20-Mar-2016', 'D-MMM-YYYY');
        const d = moment('25-Mar-2016', 'D-MMM-YYYY');

        const range1 = moment.range(a, b);
        const range2 = moment.range(c, d);

        expect(range1.overlaps(range2)).to.be.false;
        expect(range1.overlaps(range2, { adjacent: false })).to.be.false;
        expect(range1.overlaps(range2, { adjacent: true })).to.be.true;
    });
});
