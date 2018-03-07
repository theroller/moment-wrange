'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('moment.isRange()', function() {
    const m1 = moment('2011-04-15', 'YYYY-MM-DD');
    const r1 = moment.range(null, '2011-05-05');

    it('valid range => true', function() {
        expect(moment.isRange(r1)).to.be.true;
    });

    it('moment object => false', function() {
        expect(moment.isRange(m1)).to.be.false;
    });

    it('empty object => false', function() {
        expect(moment.isRange({})).to.be.false;
    });

    it('null => false', function() {
        expect(moment.isRange(null)).to.be.false;
    });
});
