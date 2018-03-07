'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('clone()', function() {
    const sStart = '1996-08-12T00:00:00.000Z';
    const sEnd = '2012-01-01T00:00:00.000Z';

    it('should deep clone range', function() {
        const dr1 = moment().range(sStart, sEnd);
        const dr2 = dr1.clone();

        dr2.start.add(2, 'days');
        expect(dr1.start.toDate()).to.not.equal(dr2.start.toDate());
    });
});
