'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('isSame()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const d3 = new Date(Date.UTC(2011, 4, 9));

    it('should true if the start and end of both MomentWrange objects equal', function() {
        const dr1 = moment.range(d1, d2);
        const dr2 = moment.range(d1, d2);

        expect(dr1.isSame(dr2)).to.be.true;
    });

    it('should false if the starts differ between objects', function() {
        const dr1 = moment.range(d1, d2);
        const dr2 = moment.range(d3, d2);

        expect(dr1.isSame(dr2)).to.be.false;
    });

    it('should false if the ends differ between objects', function() {
        const dr1 = moment.range(d1, d2);
        const dr2 = moment.range(d1, d3);

        expect(dr1.isSame(dr2)).to.be.false;
    });
});
