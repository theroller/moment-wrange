'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('reverseByRange()', function() {

    it('should return a valid iterator', function() {
        const d1 = new Date(Date.UTC(2012, 2, 1));
        const d2 = new Date(Date.UTC(2012, 2, 5));
        const d3 = new Date(Date.UTC(2012, 2, 15));
        const d4 = new Date(Date.UTC(2012, 2, 16));
        const dr1 = moment.range(d1, d2);
        const dr2 = moment.range(d3, d4);

        // Splat
        const i1 = dr1.reverseByRange(dr2);
        expect([...i1]).to.have.length(5);

        // For/of
        const i2 = dr1.reverseByRange(dr2);
        let i = 0;
        for (const _iter of i2) {
            i++;
        }
        expect(i).to.equal(5);

        // Array.from
        const i3 = dr1.reverseByRange(dr2);
        const acc = Array.from(i3);
        expect(acc).to.have.length(5);
    });

    it('should iterate correctly by range', function() {
        const d1 = new Date(Date.UTC(2012, 2, 1));
        const d2 = new Date(Date.UTC(2012, 2, 5));
        const dr1 = moment.range(d1, d2);
        const dr2 = 1000 * 60 * 60 * 24;

        const acc = Array.from(dr1.reverseByRange(dr2));

        expect(acc.length).to.eql(5);
        expect(acc[0].utc().date()).to.eql(5);
        expect(acc[1].utc().date()).to.eql(4);
        expect(acc[2].utc().date()).to.eql(3);
        expect(acc[3].utc().date()).to.eql(2);
        expect(acc[4].utc().date()).to.eql(1);
    });

    it('should iterate correctly by duration', function() {
        const d1 = new Date(Date.UTC(2014, 9, 6, 0, 1));
        const d2 = new Date(Date.UTC(2014, 9, 7, 0, 0));
        const dr1 = moment.range(d1, d2);
        const dr2 = moment.duration(15, 'minutes');

        const acc = Array.from(dr1.reverseByRange(dr2));

        expect(acc.length).to.eql(96);
        expect(acc[0].minute()).to.eql(0);
        expect(acc[95].minute()).to.eql(15);
    });

    it('should not include .start in the iteration if exclusive is set to true when iterating by range', function() {
        const my1 = moment('2014-04-02T00:00:00.000Z');
        const my2 = moment('2014-04-04T00:00:00.000Z');
        const dr1 = moment.range(my1, my2);
        const dr2 = moment.range(my1, moment('2014-04-03T00:00:00.000Z'));
        let acc;

        acc = Array.from(dr1.reverseByRange(dr2)).map(m => m.utc().format('YYYY-MM-DD'));
        expect(acc).to.eql(['2014-04-04', '2014-04-03', '2014-04-02']);

        acc = Array.from(dr1.reverseByRange(dr2, { exclusive: false })).map(m => m.utc().format('YYYY-MM-DD'));
        expect(acc).to.eql(['2014-04-04', '2014-04-03', '2014-04-02']);

        acc = Array.from(dr1.reverseByRange(dr2, { exclusive: true })).map(m => m.utc().format('YYYY-MM-DD'));
        expect(acc).to.eql(['2014-04-04', '2014-04-03']);
    });

    it('should iterate correctly by a given step', function() {
        const d1 = new Date(Date.UTC(2012, 2, 2));
        const d2 = new Date(Date.UTC(2012, 2, 6));
        const dr1 = moment.range(d1, d2);
        const dr2 = 1000 * 60 * 60 * 24;

        const acc = Array.from(dr1.reverseByRange(dr2, { step: 2 })).map(m => m.utc().format('DD'));

        expect(acc).to.eql(['06', '04', '02']);
    });

    it('should iterate correctly by a given step when exclusive', function() {
        const d1 = new Date(Date.UTC(2012, 2, 2));
        const d2 = new Date(Date.UTC(2012, 2, 6));
        const dr1 = moment.range(d1, d2);
        const dr2 = 1000 * 60 * 60 * 24;

        const acc = Array.from(dr1.reverseByRange(dr2, { exclusive: true, step: 2 })).map(m => m.utc().format('DD'));

        expect(acc).to.eql(['06', '04']);
    });
});
