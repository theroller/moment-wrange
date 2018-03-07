'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('subtract()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should turn [--{==}--] into (--) (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d8);
        const dr2 = moment.range(d6, d7);

        const result = dr1.subtract(dr2);

        expect(result[0].valueOf()).to.equal(moment.range(d5, d6).valueOf());
        expect(result[1].valueOf()).to.equal(moment.range(d7, d8).valueOf());
    });

    it('should turn {--[==]--} into () where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d8);

        expect(dr1.subtract(dr2)).to.eql([]);
    });

    it('should turn {[==]} into () where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d5, d6);

        expect(dr1.subtract(dr2)).to.eql([]);
    });

    it('should turn [--{==]--} into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d8);

        const result = dr1.subtract(dr2);

        expect(result[0].valueOf()).to.equal(moment.range(d5, d6).valueOf());
    });

    it('should turn [--{==]} into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d7);

        const result = dr1.subtract(dr2);

        expect(result[0].valueOf()).to.equal(moment.range(d5, d6).valueOf());
    });

    it('should turn {--[==}--] into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d8);
        const dr2 = moment.range(d5, d7);

        const result = dr1.subtract(dr2);

        expect(result[0].valueOf()).to.equal(moment.range(d7, d8).valueOf());
    });

    it('should turn {[==}--] into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d8);
        const dr2 = moment.range(d6, d7);

        const result = dr1.subtract(dr2);

        expect(result[0].valueOf()).to.equal(moment.range(d7, d8).valueOf());
    });

    it('should turn [--] {--} into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d7, d8);

        expect(dr1.subtract(dr2)).to.eql([dr1]);
    });

    it('should turn {--} [--] into (--) where (a=[], b={})', function() {
        const dr1 = moment.range(d7, d8);
        const dr2 = moment.range(d5, d6);

        expect(dr1.subtract(dr2)).to.eql([dr1]);
    });

    it('should turn [--{==}--] into (--) where (a=[], b={})', function() {
        const o = moment.range('2015-04-07T00:00:00+00:00/2015-04-08T00:00:00+00:00');
        const s = moment.range('2015-04-07T17:12:18+00:00/2015-04-07T17:12:18+00:00');
        const subtraction = o.subtract(s);
        const a = moment.range('2015-04-07T00:00:00+00:00/2015-04-07T17:12:18+00:00');
        const b = moment.range('2015-04-07T17:12:18+00:00/2015-04-08T00:00:00+00:00');

        expect(subtraction[0].start.isSame(a.start)).to.be.true;
        expect(subtraction[0].end.isSame(a.end)).to.be.true;
        expect(subtraction[1].start.isSame(b.start)).to.be.true;
        expect(subtraction[1].end.isSame(b.end)).to.be.true;
    });
});
