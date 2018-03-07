'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('moment().invertRanges()', function() {

    it('should return empty array: BOT===EOT', function() {
        const a = moment.range(null, null);

        const result = moment().invertRanges([a]);

        expect(result).to.have.length(0);
    });

    it('should return 2 ranges: a===a -> BOT===a a===EOT', function() {
        const a = moment.range('2000-01-01', '2000-01-31');

        const result = moment().invertRanges([a]);

        expect(result).to.have.length(2);
        expect(result[0].isEqual(moment.range(null, a.start))).to.be.true;
        expect(result[1].isEqual(moment.range(a.end, null))).to.be.true;
    });

    it('should return 3 ranges: a===a b===b -> BOT===a a===b b===EOT', function() {
        const a = moment.range('2000-01-01', '2000-01-31');
        const b = moment.range('2001-01-01', '2001-01-31');

        const result = moment().invertRanges([a, b]);

        expect(result).to.have.length(3);
        expect(result[0].isEqual(moment.range(null, a.start))).to.be.true;
        expect(result[1].isEqual(moment.range(a.end, b.start))).to.be.true;
        expect(result[2].isEqual(moment.range(b.end, null))).to.be.true;
    });

    it('should return 2 ranges: a===ab===b -> BOT===a b===EOT', function() {
        const a = moment.range('2000-01-01', '2000-01-31');
        const b = moment.range('2000-01-31', '2000-03-31');

        const result = moment().invertRanges([a, b]);

        expect(result).to.have.length(2);
        expect(result[0].isEqual(moment.range(null, a.start))).to.be.true;
        expect(result[1].isEqual(moment.range(b.end, null))).to.be.true;
    });

    it('should return 2 ranges: a==b=a==c=b==c -> BOT===a c===EOT', function() {
        const a = moment.range('2000-01-01', '2000-12-31');
        const b = moment.range('2000-02-01', '2001-03-01');
        const c = moment.range('2001-01-01', '2002-01-01');

        const result = moment().invertRanges([a, b, c]);

        expect(result).to.have.length(2);
        expect(result[0].isEqual(moment.range(null, a.start))).to.be.true;
        expect(result[1].isEqual(moment.range(c.end, null))).to.be.true;
    });

    it('roundtrip returns the original input: a===a b===b -> BOT===a a===b b===EOT -> a===a b===b', function() {
        const a = moment.range('2000-01-01', '2000-01-31');
        const b = moment.range('2001-01-01', '2001-01-31');

        const result = moment().invertRanges(moment().invertRanges([a, b]));

        expect(result).to.have.length(2);
        expect(result[0].isEqual(a)).to.be.true;
        expect(result[1].isEqual(b)).to.be.true;
    });
});
