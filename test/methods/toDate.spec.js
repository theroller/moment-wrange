'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('toDate()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));

    it('should be a array like [dateObject, dateObject]', function() {
        const dr = moment.range(d1, d2);
        const drTodate = dr.toDate();

        expect(drTodate.length).to.eql(2);
        expect(drTodate[0].valueOf()).to.eql(d1.valueOf());
        expect(drTodate[1].valueOf()).to.eql(d2.valueOf());
    });
});
