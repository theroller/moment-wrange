'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('adjacent()', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const d3 = new Date(Date.UTC(2011, 4, 9));
    const d4 = new Date(Date.UTC(1988, 0, 1));

    it('should correctly indicate when ranges aren\'t adjacent', function() {
        const a = moment.range(d4, d1);
        const b = moment.range(d3, d2);

        expect(a.adjacent(b)).to.be.false;
    });

    it('should correctly indicate when a.start == b.start', function() {
        const a = moment('15-Mar-2016', 'D-MMM-YYYY');
        const b = moment('29-Mar-2016', 'D-MMM-YYYY');
        const c = moment('30-Mar-2016', 'D-MMM-YYYY');

        const range1 = moment.range(a, b);
        const range2 = moment.range(a, c);

        expect(range1.adjacent(range2)).to.be.false;
    });

    it('should correctly indicate when a.start == b.end', function() {
        const a = moment('15-Mar-2016', 'D-MMM-YYYY');
        const b = moment('29-Mar-2016', 'D-MMM-YYYY');
        const c = moment('10-Mar-2016', 'D-MMM-YYYY');

        const range1 = moment.range(a, b);
        const range2 = moment.range(c, a);

        expect(range1.adjacent(range2)).to.be.true;
    });

    it('should correctly indicate when a.end == b.start', function() {
        const a = moment('15-Mar-2016', 'D-MMM-YYYY');
        const b = moment('20-Mar-2016', 'D-MMM-YYYY');
        const c = moment('25-Mar-2016', 'D-MMM-YYYY');

        const range1 = moment.range(a, b);
        const range2 = moment.range(b, c);

        expect(range1.adjacent(range2)).to.be.true;
    });

    it('should correctly indicate when a.end == b.end', function() {
        const a = moment('15-Mar-2016', 'D-MMM-YYYY');
        const b = moment('20-Mar-2016', 'D-MMM-YYYY');
        const c = moment('10-Mar-2016', 'D-MMM-YYYY');

        const range1 = moment.range(a, b);
        const range2 = moment.range(c, b);

        expect(range1.adjacent(range2)).to.be.false;
    });

    describe('granularity', function() {
        it('"second" should detect adjacent ranges with less than a second difference', function() {
            const a = moment('2000-01-01');
            const b = a.clone().add(1, 'year');
            const c = b.clone().add(100, 'millisecond');
            const d = c.clone().add(1, 'year');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.adjacent(range2, 'second')).to.be.true;
        });

        it('"minute" should detect adjacent ranges with less than a minute difference', function() {
            const a = moment('2000-01-01');
            const b = a.clone().add(1, 'year');
            const c = b.clone().add(30, 'second');
            const d = c.clone().add(1, 'year');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.adjacent(range2, 'minute')).to.be.true;
        });

        it('"hour" should detect adjacent ranges with less than a hour difference', function() {
            const a = moment('2000-01-01');
            const b = a.clone().add(1, 'year');
            const c = b.clone().add(30, 'minute');
            const d = c.clone().add(1, 'year');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.adjacent(range2, 'hour')).to.be.true;
        });

        it('"day" should detect adjacent ranges with less than a day difference', function() {
            const a = moment('2000-01-01');
            const b = a.clone().add(1, 'year');
            const c = b.clone().add(12, 'hour');
            const d = c.clone().add(1, 'year');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.adjacent(range2, 'day')).to.be.true;
        });

        it('"year" should detect adjacent ranges with less than a year difference', function() {
            const a = moment('2000-01-01');
            const b = a.clone().add(1, 'year');
            const c = b.clone().add(30, 'day');
            const d = c.clone().add(1, 'year');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.adjacent(range2, 'year')).to.be.true;
        });
    });
});
