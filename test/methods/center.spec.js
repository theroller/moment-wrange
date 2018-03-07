'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('center()', function() {

    it('should use momentjs’ center method', function() {
        const d1 = new Date(Date.UTC(2011, 2, 5));
        const d2 = new Date(Date.UTC(2011, 3, 5));
        const dr = moment.range(d1, d2);

        expect(dr.center().valueOf()).to.equal(1300622400000);
    });
});
