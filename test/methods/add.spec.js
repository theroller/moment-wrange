'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('add()', function() {
    const d5 = new Date(Date.UTC(2011, 2, 2));
    const d6 = new Date(Date.UTC(2011, 4, 4));
    const d7 = new Date(Date.UTC(2011, 6, 6));
    const d8 = new Date(Date.UTC(2011, 8, 8));

    it('should add ranges with [---{==]---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d8);

        expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be.true;
    });

    it('should add ranges with {---[==}---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d8);
        const dr2 = moment.range(d5, d7);

        expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be.true;
    });

    it('should add ranges with [{===]---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d5, d7);

        expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be.true;
    });

    it('should add ranges with {[===}---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d5, d6);

        expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be.true;
    });

    it('should add ranges with [---{===]} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d7);
        const dr2 = moment.range(d6, d7);

        expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be.true;
    });

    it('should add ranges with {---[===}] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d7);

        expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be.true;
    });

    it('should not add ranges with [---] {---} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d7, d8);

        expect(dr1.add(dr2)).to.be.null;
    });

    it('should not add ranges with {---} [---] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d7, d8);
        const dr2 = moment.range(d5, d6);

        expect(dr1.add(dr2)).to.be.null;
    });

    it('should not add ranges with [---]{---} overlaps where (a=[], b={}) and options.adjacent = false', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d6, d7);

        expect(dr1.add(dr2, { adjacent: false })).to.be.null;
    });

    it('should add ranges with [---]{---} overlaps where (a=[], b={}) and options.adjacent = true', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d6, d7);

        expect(dr1.add(dr2, { adjacent: true })).to.eql(moment.range(d5, d7));
    });

    it('should not add ranges with {---}[---] overlaps where (a=[], b={}) and options.adjacent = false', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d6);

        expect(dr1.add(dr2, { adjacent: false })).to.be.null;
    });

    it('should add ranges with {---}[---] overlaps where (a=[], b={}) and options.adjacent = true', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d6);

        expect(dr1.add(dr2, { adjacent: true })).to.eql(moment.range(d5, d7));
    });

    it('should add ranges {--[===]--} overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d6, d7);
        const dr2 = moment.range(d5, d8);

        expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be.true;
    });

    it('should add ranges [--{===}--] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d8);
        const dr2 = moment.range(d6, d7);

        expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be.true;
    });

    it('should add ranges [{===}] overlaps where (a=[], b={})', function() {
        const dr1 = moment.range(d5, d6);
        const dr2 = moment.range(d5, d6);

        expect(dr1.add(dr2).isSame(moment.range(d5, d6))).to.be.true;
    });
});
