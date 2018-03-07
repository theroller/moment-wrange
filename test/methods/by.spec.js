'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('by()', function() {

    it('should return a valid iterator', function() {
        const d1 = new Date(Date.UTC(2012, 2, 1));
        const d2 = new Date(Date.UTC(2012, 2, 5));
        const dr1 = moment.range(d1, d2);

        // Splat
        const i1 = dr1.by('day');
        expect([...i1]).to.have.length(5);

        // For/of
        const i2 = dr1.by('day');
        let i = 0;
        for (const _iter of i2) {
            i++;
        }
        expect(i).to.equal(5);

        // Array.from
        const i3 = dr1.by('day');
        const acc = Array.from(i3);
        expect(acc).to.have.length(5);
    });

    it('should iterate correctly by shorthand string', function() {
        const d1 = new Date(Date.UTC(2012, 2, 1));
        const d2 = new Date(Date.UTC(2012, 2, 5));
        const dr1 = moment.range(d1, d2);

        const i1 = dr1.by('days');
        const acc = Array.from(i1);

        expect(acc.length).to.eql(5);
        expect(acc[0].utc().date()).to.eql(1);
        expect(acc[1].utc().date()).to.eql(2);
        expect(acc[2].utc().date()).to.eql(3);
        expect(acc[3].utc().date()).to.eql(4);
        expect(acc[4].utc().date()).to.eql(5);
    });

    it('should iterate correctly by year over a Date-constructed range when leap years are involved', function() {
        const d1 = new Date(Date.UTC(2011, 1, 1));
        const d2 = new Date(Date.UTC(2013, 1, 1));
        const dr1 = moment.range(d1, d2);

        const i1 = dr1.by('years');
        const acc = Array.from(i1).map(m => m.utc().year());

        expect(acc).to.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by year over a moment()-constructed range when leap years are involved', function() {
        const dr1 = moment.range(moment('2011', 'YYYY'), moment('2013', 'YYYY'));

        const i1 = dr1.by('years');
        const acc = Array.from(i1).map(m => m.year());

        expect(acc).to.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by month over a moment()-constructed range when leap years are involved', function() {
        const dr1 = moment.range(moment.utc('2012-01', 'YYYY-MM'), moment.utc('2012-03', 'YYYY-MM'));

        const i1 = dr1.by('months');
        const acc = Array.from(i1).map(m => m.utc().format('YYYY-MM'));

        expect(acc).to.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should iterate correctly by month over a Date-contstructed range when leap years are involved', function() {
        const d1 = new Date(Date.UTC(2012, 0));
        const d2 = new Date(Date.UTC(2012, 2));
        const dr1 = moment.range(d1, d2);

        const i1 = dr1.by('months');
        const acc = Array.from(i1).map(m => m.utc().format('YYYY-MM'));

        expect(acc).to.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should not include .end in the iteration if exclusive is set to true when iterating by string', function() {
        const my1 = moment('2014-04-02T00:00:00.000Z');
        const my2 = moment('2014-04-04T00:00:00.000Z');
        const dr1 = moment.range(my1, my2);
        const options = { exclusive: true };
        let acc;

        acc = Array.from(dr1.by('d', options)).map(m => m.utc().format('YYYY-MM-DD'));
        expect(acc).to.eql(['2014-04-02', '2014-04-03']);

        acc = Array.from(dr1.by('d')).map(m => m.utc().format('YYYY-MM-DD'));
        expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);
    });

    it('should be exlusive when using by with minutes as well', function() {
        const d1 = moment('2014-01-01T00:00:00.000Z');
        const d2 = moment('2014-01-01T00:06:00.000Z');
        const dr = moment.range(d1, d2);
        const options = { exclusive: true };
        let acc;

        acc = Array.from(dr.by('m')).map(m => m.utc().format('mm'));
        expect(acc).to.eql(['00', '01', '02', '03', '04', '05', '06']);

        acc = Array.from(dr.by('m', options)).map(m => m.utc().format('mm'));
        expect(acc).to.eql(['00', '01', '02', '03', '04', '05']);
    });

    it('should correctly iterate by a given step', function() {
        const my1 = moment('2014-04-02T00:00:00.000Z');
        const my2 = moment('2014-04-08T00:00:00.000Z');
        const dr1 = moment.range(my1, my2);

        const acc = Array.from(dr1.by('days', { step: 2 })).map(m => m.utc().format('DD'));
        expect(acc).to.eql(['02', '04', '06', '08']);
    });

    it('should correctly iterate by a given step when exclusive', function() {
        const my1 = moment('2014-04-02T00:00:00.000Z');
        const my2 = moment('2014-04-08T00:00:00.000Z');
        const dr1 = moment.range(my1, my2);

        const acc = Array.from(dr1.by('days', { exclusive: true, step: 2 })).map(m => m.utc().format('DD'));
        expect(acc).to.eql(['02', '04', '06']);
    });
});
