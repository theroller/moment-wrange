'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('diff()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));

    it('should use momentjs’ diff method', function() {
        const dr = moment.range(d1, d2);

        expect(dr.diff('months')).to.equal(3);
        expect(dr.diff('days')).to.equal(92);
        expect(dr.diff()).to.equal(7948800000);
    });

    it('should optionally pass the rounded argument', function() {
        const d1 = new Date(Date.UTC(2011, 4, 1));
        const d2 = new Date(Date.UTC(2011, 4, 5, 12));
        const dr = moment.range(d1, d2);

        expect(dr.diff('days', true)).to.equal(4.5);
    });
});
