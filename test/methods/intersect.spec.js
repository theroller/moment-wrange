'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('intersect()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should work with [---{==]---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d8);

        expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be.true;
    });

    it('should work with {---[==}---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d8);
        const dr2 = moment.range(d5, d7);

        expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be.true;
    });

    it('should work with [{===]---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d5, d7);

        expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be.true;
    });

    it('should work with {[===}---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d5, d6);

        expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be.true;
    });

    it('should work with [---{===]} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d7);

        expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be.true;
    });

    it('should work with {---[===}] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d7);

        expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be.true;
    });

    it('should work with [---] {---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d7, d8);

        expect(dr1.intersect(dr2)).to.be.null;
    });

    it('should work with {---} [---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d7, d8);
        const dr2 = moment.range(d5, d6);

        expect(dr1.intersect(dr2)).to.be.null;
    });

    it('should work with [---]{---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d6, d7);

        expect(dr1.intersect(dr2)).to.be.null;
    });

    it('should work with {---}[---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d6);
        expect(dr1.intersect(dr2)).to.be.null;
    });

    it('should work with {--[===]--} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d8);

        expect(dr1.intersect(dr2).isSame(dr1)).to.be.true;
    });

    it('should work with [--{===}--] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d8);
        const dr2 = moment.range(d6, d7);

        expect(dr1.intersect(dr2).isSame(dr2)).to.be.true;
    });

    it('should work with [{===}] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d5, d6);

        expect(dr1.intersect(dr2).isSame(dr2)).to.be.true;
    });

    it('should work with [--{}--] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d6);
        const dr2 = moment.range(d5, d7);

        expect(dr1.intersect(dr2).isSame(dr1)).to.be.true;
    });
});
