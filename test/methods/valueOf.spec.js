'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('valueOf()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const d3 = new Date(Date.UTC(2011, 4, 9));
    const d4 = new Date(Date.UTC(1988, 0, 1));

    it('should be the value of the range in milliseconds', function() {
        const dr = moment.range(d1, d2);

        expect(dr.valueOf()).to.eql(d2.getTime() - d1.getTime());
    });

    it('should correctly coerce to a number', function() {
        const dr1 = moment.range(d4, d2);
        const dr2 = moment.range(d3, d2);

        expect((dr1 > dr2)).to.be.true;
    });
});
