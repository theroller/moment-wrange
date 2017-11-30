'use strict';

const { expect } = require('chai');
const { extendMoment, MAX_MOMENT, MIN_MOMENT } = require('../src/moment-range');
const moment = extendMoment(require('moment'));


describe('properties', function() {
    it('MAX_MOMENT = 8640000000000000 milliseconds', function() {
        expect(MAX_MOMENT.valueOf()).to.equal(8640000000000000);
    });

    it('MIN_MOMENT = -8640000000000000 milliseconds', function() {
        expect(MIN_MOMENT.valueOf()).to.equal(-8640000000000000);
    });
});

describe('Moment', function() {
    const m1 = moment('2011-04-15', 'YYYY-MM-DD');
    const m2 = moment('2012-12-25', 'YYYY-MM-DD');
    const mStart = moment('2011-03-05', 'YYYY-MM-DD');
    const mEnd = moment('2011-06-05', 'YYYY-MM-DD');
    const or = moment.range(null, '2011-05-05');
    const or2 = moment.range('2011-03-05', null);

    describe('#range()', function() {
        it('should return a DateRange with start & end properties', function() {
            const dr = moment.range(m1, m2);
            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should support string units like `year`, `month`, `week`, `day`, `minute`, `second`, etc...', function() {
            const dr = m1.range('year');
            expect(dr.start.valueOf()).to.equal(moment(m1).startOf('year').valueOf());
            expect(dr.end.valueOf()).to.equal(moment(m1).endOf('year').valueOf());
        });
    });

    describe('#within()', function() {
        it('should determine if the current moment is within a given range', function() {
            const dr = m1.range('year');
            expect(m1.within(dr)).to.be.true;
            expect(m2.within(dr)).to.be.false;
            expect(m1.within(or)).to.be.true;
            expect(m1.within(or2)).to.be.true;
            expect(m2.within(or)).to.be.false;
            expect(m2.within(or2)).to.be.true;
        });

        it('should consider the edges to be within the range', function() {
            const dr = moment.range(mStart, mEnd);
            expect(mStart.within(dr)).to.be.true;
            expect(mEnd.within(dr)).to.be.true;
        });
    });

    describe('#mergeRanges()', function() {
        describe('ascending ordered input ranges', function() {
            it('should not merge ranges a===a b===b c===c', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-03-01', '2000-03-31');
                const c = moment.range('2000-05-01', '2000-05-31');

                const result = moment().mergeRanges([a, b, c]);

                expect(result).to.have.length(3);
                expect(result[0]).to.equal(a);
                expect(result[1]).to.equal(b);
                expect(result[2]).to.equal(c);
            });

            it('should only merge a+b a==b=a==b c===c', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-03-31');
                const c = moment.range('2000-05-01', '2000-05-31');

                const result = moment().mergeRanges([a, b, c]);

                expect(result).to.have.length(2);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
                expect(result[1]).to.equal(c);
            });

            it('should only merge b+c a===a b==c=b==c', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-03-01', '2000-03-31');
                const c = moment.range('2000-03-15', '2000-05-31');

                const result = moment().mergeRanges([a, b, c]);

                expect(result).to.have.length(2);
                expect(result[0]).to.equal(a);
                expect(result[1]).to.eql(moment.range(b.start, c.end));
            });

            it('should merge a+b+c a==b=a=c=b==c', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-02-15');
                const c = moment.range('2000-02-01', '2000-03-01');

                const result = moment().mergeRanges([a, b, c]);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, c.end));
            });

            it('should merge a+b+c a==b=a=c===c=b', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-06-01');
                const c = moment.range('2000-02-01', '2000-03-01');

                const result = moment().mergeRanges([a, b, c]);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
            });

            it('should merge a+b a===ab===b', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-31', '2000-03-01');

                const result = moment().mergeRanges([a, b]);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
            });
        });

        describe('descending order input array', function() {
            it('should not merge ranges a===a b===b c===c AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-03-01', '2000-03-31');
                const c = moment.range('2000-05-01', '2000-05-31');

                const array = [c, b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(3);
                expect(result[0]).to.equal(a);
                expect(result[1]).to.equal(b);
                expect(result[2]).to.equal(c);
                expect(array, 'array input should be unmodified').to.eql([c, b, a]);
            });

            it('should only merge a+b a==b=a==b c===c AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-03-31');
                const c = moment.range('2000-05-01', '2000-05-31');

                const array = [c, b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(2);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
                expect(result[1]).to.equal(c);
                expect(array, 'array input should be unmodified').to.eql([c, b, a]);
            });

            it('should only merge b+c a===a b==c=b==c AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-03-01', '2000-03-31');
                const c = moment.range('2000-03-15', '2000-05-31');

                const array = [c, b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(2);
                expect(result[0]).to.equal(a);
                expect(result[1]).to.eql(moment.range(b.start, c.end));
                expect(array, 'array input should be unmodified').to.eql([c, b, a]);
            });

            it('should merge a+b+c a==b=a=c=b==c AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-02-15');
                const c = moment.range('2000-02-01', '2000-03-01');

                const array = [c, b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, c.end));
                expect(array, 'array input should be unmodified').to.eql([c, b, a]);
            });

            it('should merge a+b+c a==b=a=c===c=b AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-15', '2000-06-01');
                const c = moment.range('2000-02-01', '2000-03-01');

                const array = [c, b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
                expect(array, 'array input should be unmodified').to.eql([c, b, a]);
            });

            it('should merge a+b a===ab===b AND not change the input array', function() {
                const a = moment.range('2000-01-01', '2000-01-31');
                const b = moment.range('2000-01-31', '2000-03-01');

                const array = [b, a];
                const result = moment().mergeRanges(array);

                expect(result).to.have.length(1);
                expect(result[0]).to.eql(moment.range(a.start, b.end));
                expect(array, 'array input should be unmodified').to.eql([b, a]);
            });
        });
    });

    describe('#invertRanges()', function() {
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
});

describe('DateRange', function() {
    const d1 = new Date(Date.UTC(2011, 2, 5));
    const d2 = new Date(Date.UTC(2011, 5, 5));
    const d3 = new Date(Date.UTC(2011, 4, 9));
    const d4 = new Date(Date.UTC(1988, 0, 1));
    const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
    const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
    const m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
    const m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');
    const sStart = '1996-08-12T00:00:00.000Z';
    const sEnd = '2012-01-01T00:00:00.000Z';

    describe('constructor', function() {
        it('should allow initialization with date string', function() {
            const dr = moment.range(sStart, sEnd);

            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization with Date object', function() {
            const dr = moment.range(d1, d2);

            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization with Moment object', function() {
            const dr = moment.range(m1, m2);

            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization with an ISO 8601 Time Interval string', function() {
            const start = '2015-01-17T09:50:04+00:00';
            const end   = '2015-04-17T08:29:55+00:00';
            const dr = moment.range(start + '/' + end);

            expect(moment.utc(start).isSame(dr.start)).to.be.true;
            expect(moment.utc(end).isSame(dr.end)).to.be.true;
        });

        it('should allow initialization with an array', function() {
            const dr = moment.range([m1, m2]);

            expect(m1.isSame(dr.start)).to.be.true;
            expect(m2.isSame(dr.end)).to.be.true;
        });

        it('should allow initialization with open-ended ranges', function() {
            let dr = moment.range(null, m1);

            expect(moment.isMoment(dr.start)).to.be.true;

            dr = moment.range(m1, null);

            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization without any arguments', function() {
            const dr = moment.range();

            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization with undefined arguments', function() {
            const dr = moment.range(undefined, undefined);

            expect(moment.isMoment(dr.start)).to.be.true;
            expect(moment.isMoment(dr.end)).to.be.true;
        });

        it('should allow initialization with moment interval strings', function() {
            const date = moment('2016-12-12T11:12:18.607');
            const quarterStart = moment('2016-10-01T00:00:00.000');
            const quarterEnd = moment('2016-12-31T23:59:59.999');
            const r = date.range('quarter');

            expect(r.start.isSame(quarterStart)).to.be.true;
            expect(r.end.isSame(quarterEnd)).to.be.true;
        });
    });

    describe('#adjacent', function() {
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

    describe('#clone()', function() {
        it('should deep clone range', function() {
            const dr1 = moment().range(sStart, sEnd);
            const dr2 = dr1.clone();

            dr2.start.add(2, 'days');
            expect(dr1.start.toDate()).to.not.equal(dr2.start.toDate());
        });
    });

    describe('#by', function() {
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

    describe('#reverseBy', function() {
        it('should return a valid iterator', function() {
            const d1 = new Date(Date.UTC(2012, 2, 1));
            const d2 = new Date(Date.UTC(2012, 2, 5));
            const dr1 = moment.range(d1, d2);

            // Splat
            const i1 = dr1.reverseBy('day');
            expect([...i1]).to.have.length(5);

            // For/of
            const i2 = dr1.reverseBy('day');
            let i = 0;
            for (const _iter of i2) {
                i++;
            }
            expect(i).to.equal(5);

            // Array.from
            const i3 = dr1.reverseBy('day');
            const acc = Array.from(i3);
            expect(acc).to.have.length(5);
        });

        it('should iterate correctly by shorthand string', function() {
            const d1 = new Date(Date.UTC(2012, 2, 1));
            const d2 = new Date(Date.UTC(2012, 2, 5));
            const dr1 = moment.range(d1, d2);

            const i1 = dr1.reverseBy('days');
            const acc = Array.from(i1);

            expect(acc.length).to.eql(5);
            expect(acc[0].utc().date()).to.eql(5);
            expect(acc[1].utc().date()).to.eql(4);
            expect(acc[2].utc().date()).to.eql(3);
            expect(acc[3].utc().date()).to.eql(2);
            expect(acc[4].utc().date()).to.eql(1);
        });

        it('should iterate correctly by year over a Date-constructed range when leap years are involved', function() {
            const d1 = new Date(Date.UTC(2011, 1, 1));
            const d2 = new Date(Date.UTC(2013, 1, 1));
            const dr1 = moment.range(d1, d2);

            const i1 = dr1.reverseBy('years');
            const acc = Array.from(i1).map(m => m.utc().year());

            expect(acc).to.eql([2013, 2012, 2011]);
        });

        it('should iterate correctly by year over a moment()-constructed range when leap years are involved', function() {
            const dr1 = moment.range(moment('2011', 'YYYY'), moment('2013', 'YYYY'));

            const i1 = dr1.reverseBy('years');
            const acc = Array.from(i1).map(m => m.year());

            expect(acc).to.eql([2013, 2012, 2011]);
        });

        it('should iterate correctly by month over a moment()-constructed range when leap years are involved', function() {
            const dr1 = moment.range(moment.utc('2012-01', 'YYYY-MM'), moment.utc('2012-03', 'YYYY-MM'));

            const i1 = dr1.reverseBy('months');
            const acc = Array.from(i1).map(m => m.utc().format('YYYY-MM'));

            expect(acc).to.eql(['2012-03', '2012-02', '2012-01']);
        });

        it('should iterate correctly by month over a Date-contstructed range when leap years are involved', function() {
            const d1 = new Date(Date.UTC(2012, 0, 1));
            const d2 = new Date(Date.UTC(2012, 2, 28));
            const dr1 = moment.range(d1, d2);

            const i1 = dr1.reverseBy('months');
            const acc = Array.from(i1).map(m => m.utc().format('YYYY-MM'));

            expect(acc).to.eql(['2012-03', '2012-02', '2012-01']);
        });

        it('should not include .start in the iteration if exclusive is set to true when iterating by string', function() {
            const my1 = moment.utc('2014-04-02T00:00:00');
            const my2 = moment.utc('2014-04-04T23:59:59');
            const dr1 = moment.range(my1, my2);
            const options = { exclusive: true };
            let acc;

            acc = Array.from(dr1.reverseBy('d', options)).map(m => m.utc().format('YYYY-MM-DD'));
            expect(acc).to.eql(['2014-04-04', '2014-04-03']);

            acc = Array.from(dr1.reverseBy('d')).map(m => m.utc().format('YYYY-MM-DD'));
            expect(acc).to.eql(['2014-04-04', '2014-04-03', '2014-04-02']);
        });

        it('should be exlusive when using by with minutes as well', function() {
            const d1 = moment('2014-01-01T00:00:00.000Z');
            const d2 = moment('2014-01-01T00:06:00.000Z');
            const dr = moment.range(d1, d2);
            const options = { exclusive: true };
            let acc;

            acc = Array.from(dr.reverseBy('m')).map(m => m.utc().format('mm'));
            expect(acc).to.eql(['06', '05', '04', '03', '02', '01', '00']);

            acc = Array.from(dr.reverseBy('m', options)).map(m => m.utc().format('mm'));
            expect(acc).to.eql(['06', '05', '04', '03', '02', '01']);
        });

        it('should correctly iterate by a given step', function() {
            const my1 = moment('2014-04-02T00:00:00.000Z');
            const my2 = moment('2014-04-08T00:00:00.000Z');
            const dr1 = moment.range(my1, my2);

            const acc = Array.from(dr1.reverseBy('days', { step: 2 })).map(m => m.utc().format('DD'));
            expect(acc).to.eql(['08', '06', '04', '02']);
        });

        it('should correctly iterate by a given step when exclusive', function() {
            const my1 = moment('2014-04-02T00:00:00.000Z');
            const my2 = moment('2014-04-08T00:00:00.000Z');
            const dr1 = moment.range(my1, my2);

            const acc = Array.from(dr1.reverseBy('days', { exclusive: true, step: 2 })).map(m => m.utc().format('DD'));
            expect(acc).to.eql(['08', '06', '04']);
        });
    });

    describe('#byRange', function() {
        it('should return a valid iterator', function() {
            const d1 = new Date(Date.UTC(2012, 2, 1));
            const d2 = new Date(Date.UTC(2012, 2, 5));
            const d3 = new Date(Date.UTC(2012, 2, 15));
            const d4 = new Date(Date.UTC(2012, 2, 16));
            const dr1 = moment.range(d1, d2);
            const dr2 = moment.range(d3, d4);

            // Splat
            const i1 = dr1.byRange(dr2);
            expect([...i1]).to.have.length(5);

            // For/of
            const i2 = dr1.byRange(dr2);
            let i = 0;
            for (const _iter of i2) {
                i++;
            }
            expect(i).to.equal(5);

            // Array.from
            const i3 = dr1.byRange(dr2);
            const acc = Array.from(i3);
            expect(acc).to.have.length(5);
        });

        it('should iterate correctly by range', function() {
            const d1 = new Date(Date.UTC(2012, 2, 1));
            const d2 = new Date(Date.UTC(2012, 2, 5));
            const dr1 = moment.range(d1, d2);
            const dr2 = 1000 * 60 * 60 * 24;

            const acc = Array.from(dr1.byRange(dr2));

            expect(acc.length).to.eql(5);
            expect(acc[0].utc().date()).to.eql(1);
            expect(acc[1].utc().date()).to.eql(2);
            expect(acc[2].utc().date()).to.eql(3);
            expect(acc[3].utc().date()).to.eql(4);
            expect(acc[4].utc().date()).to.eql(5);
        });

        it('should iterate correctly by duration', function() {
            const d1 = new Date(Date.UTC(2014, 9, 6, 0, 0));
            const d2 = new Date(Date.UTC(2014, 9, 6, 23, 59));
            const dr1 = moment.range(d1, d2);
            const dr2 = moment.duration(15, 'minutes');

            const acc = Array.from(dr1.byRange(dr2));

            expect(acc.length).to.eql(96);
            expect(acc[0].minute()).to.eql(0);
            expect(acc[95].minute()).to.eql(45);
        });

        it('should not include .end in the iteration if exclusive is set to true when iterating by range', function() {
            const my1 = moment('2014-04-02T00:00:00.000Z');
            const my2 = moment('2014-04-04T00:00:00.000Z');
            const dr1 = moment.range(my1, my2);
            const dr2 = moment.range(my1, moment('2014-04-03T00:00:00.000Z'));
            let acc;

            acc = Array.from(dr1.byRange(dr2)).map(m => m.utc().format('YYYY-MM-DD'));
            expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

            acc = Array.from(dr1.byRange(dr2, { exclusive: false })).map(m => m.utc().format('YYYY-MM-DD'));
            expect(acc).to.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

            acc = Array.from(dr1.byRange(dr2, { exclusive: true })).map(m => m.utc().format('YYYY-MM-DD'));
            expect(acc).to.eql(['2014-04-02', '2014-04-03']);
        });

        it('should iterate correctly by a given step', function() {
            const d1 = new Date(Date.UTC(2012, 2, 2));
            const d2 = new Date(Date.UTC(2012, 2, 6));
            const dr1 = moment.range(d1, d2);
            const dr2 = 1000 * 60 * 60 * 24;

            const acc = Array.from(dr1.byRange(dr2, { step: 2 })).map(m => m.utc().format('DD'));

            expect(acc).to.eql(['02', '04', '06']);
        });

        it('should iterate correctly by a given step when exclusive', function() {
            const d1 = new Date(Date.UTC(2012, 2, 2));
            const d2 = new Date(Date.UTC(2012, 2, 6));
            const dr1 = moment.range(d1, d2);
            const dr2 = 1000 * 60 * 60 * 24;

            const acc = Array.from(dr1.byRange(dr2, { exclusive: true, step: 2 })).map(m => m.utc().format('DD'));

            expect(acc).to.eql(['02', '04']);
        });
    });

    describe('#reverseByRange', function() {
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

    describe('#contains()', function() {
        it('should work with Date objects', function() {
            const dr = moment.range(d1, d2);

            expect(dr.contains(d3)).to.be.true;
            expect(dr.contains(d4)).to.be.false;
        });

        it('should work with Moment objects', function() {
            const dr = moment.range(m1, m2);

            expect(dr.contains(m3)).to.be.true;
            expect(dr.contains(m4)).to.be.false;
        });

        it('should work with DateRange objects', function() {
            const dr1 = moment.range(m1, m4);
            const dr2 = moment.range(m3, m2);

            expect(dr1.contains(dr2)).to.be.true;
            expect(dr2.contains(dr1)).to.be.false;
        });

        it('should be an inclusive comparison', function() {
            const dr1 = moment.range(m1, m4);

            expect(dr1.contains(m1)).to.be.true;
            expect(dr1.contains(m4)).to.be.true;
            expect(dr1.contains(dr1)).to.be.true;
        });

        it('should be exclusive when the inclusivity param is set to "()"', function() {
            const dr1 = moment.range(m1, m2);

            expect(dr1.contains(dr1, null, '()')).to.be.false;
            expect(dr1.contains(dr1, null, '[]')).to.be.true;
            expect(dr1.contains(dr1)).to.be.true;
            expect(dr1.contains(m2, null, '()')).to.be.false;
            expect(dr1.contains(m2, null, '[]')).to.be.true;
            expect(dr1.contains(m2)).to.be.true;
        });

        it('should apply units in comparison', function() {
            const my1 = moment('2000-06-15T12:00:00.000Z');
            const my2 = moment('2010-06-15T12:00:00.000Z');
            const dr1 = moment.range(my1, my2);
            const my1H1 = my1.clone().subtract(1, 'hour');
            const my1D1 = my1.clone().subtract(1, 'day');
            const my1M1 = my1.clone().subtract(1, 'month');
            const my2H1 = my2.clone().add(1, 'hour');
            const my2D1 = my2.clone().add(1, 'day');
            const my2M1 = my2.clone().add(1, 'month');

            expect(dr1.contains(my1H1)).to.be.false;
            expect(dr1.contains(my1H1, 'day')).to.be.true;
            expect(dr1.contains(my1D1)).to.be.false;
            expect(dr1.contains(my1D1, 'month')).to.be.true;
            expect(dr1.contains(my1M1)).to.be.false;
            expect(dr1.contains(my1M1, 'year')).to.be.true;

            expect(dr1.contains(my2H1)).to.be.false;
            expect(dr1.contains(my2H1, 'day')).to.be.true;
            expect(dr1.contains(my2D1)).to.be.false;
            expect(dr1.contains(my2D1, 'month')).to.be.true;
            expect(dr1.contains(my2M1)).to.be.false;
            expect(dr1.contains(my2M1, 'year')).to.be.true;
        });
    });

    describe('#overlaps()', function() {
        it('should work with DateRange objects', function() {
            const dr1 = moment.range(m1, m2);
            const dr2 = moment.range(m3, m4);
            const dr3 = moment.range(m2, m4);
            const dr4 = moment.range(m1, m3);

            expect(dr1.overlaps(dr2)).to.be.true;
            expect(dr1.overlaps(dr3)).to.be.false;
            expect(dr4.overlaps(dr3)).to.be.false;
        });

        it('should indicate if ranges overlap if the options is passed in', function() {
            const a = moment('15-Mar-2016', 'D-MMM-YYYY');
            const b = moment('20-Mar-2016', 'D-MMM-YYYY');
            const c = moment('20-Mar-2016', 'D-MMM-YYYY');
            const d = moment('25-Mar-2016', 'D-MMM-YYYY');

            const range1 = moment.range(a, b);
            const range2 = moment.range(c, d);

            expect(range1.overlaps(range2)).to.be.false;
            expect(range1.overlaps(range2, { adjacent: false })).to.be.false;
            expect(range1.overlaps(range2, { adjacent: true })).to.be.true;
        });
    });

    describe('#intersect()', function() {
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

    describe('#add()', function() {
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

    describe('#subtract()', function() {
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

    describe('#isSame()', function() {
        it('should true if the start and end of both DateRange objects equal', function() {
            const dr1 = moment.range(d1, d2);
            const dr2 = moment.range(d1, d2);

            expect(dr1.isSame(dr2)).to.be.true;
        });

        it('should false if the starts differ between objects', function() {
            const dr1 = moment.range(d1, d2);
            const dr2 = moment.range(d3, d2);

            expect(dr1.isSame(dr2)).to.be.false;
        });

        it('should false if the ends differ between objects', function() {
            const dr1 = moment.range(d1, d2);
            const dr2 = moment.range(d1, d3);

            expect(dr1.isSame(dr2)).to.be.false;
        });
    });

    describe('#toString()', function() {
        it('should be a correctly formatted ISO8601 Time Interval', function() {
            const start = moment.utc('2015-01-17T09:50:04+00:00');
            const end   = moment.utc('2015-04-17T08:29:55+00:00');
            const dr = moment.range(start, end);

            expect(dr.toString()).to.equal(start.format() + '/' + end.format());
        });
    });

    describe('#valueOf()', function() {
        it('should be the value of the range in milliseconds', function() {
            const dr = moment.range(d1, d2);

            expect(dr.valueOf()).to.eql(d2.getTime() - d1.getTime());
        });

        it('should correctly coerce to a number', function() {
            const dr1 = moment.range(d4, d2);
            const dr2 = moment.range(d3, d2);

            expect((dr1 > dr2)).to.be.true;
        });
    });

    describe('#toDate()', function() {
        it('should be a array like [dateObject, dateObject]', function() {
            const dr = moment.range(d1, d2);
            const drTodate = dr.toDate();

            expect(drTodate.length).to.eql(2);
            expect(drTodate[0].valueOf()).to.eql(d1.valueOf());
            expect(drTodate[1].valueOf()).to.eql(d2.valueOf());
        });
    });

    describe('#diff()', function() {
        it('should use momentjs’ diff method', function() {
            const dr = moment.range(d1, d2);

            expect(dr.diff('months')).to.equal(3);
            expect(dr.diff('days')).to.equal(92);
            expect(dr.diff()).to.equal(7948800000);
        });

        it('should optionally pass the rounded argument', function() {
            const d1 = new Date(Date.UTC(2011, 4, 1));
            const d2 = new Date(Date.UTC(2011, 4, 5, 12));
            const dr = moment.range(d1, d2);

            expect(dr.diff('days', true)).to.equal(4.5);
        });
    });

    describe('#center()', function() {
        it('should use momentjs’ center method', function() {
            const d1 = new Date(Date.UTC(2011, 2, 5));
            const d2 = new Date(Date.UTC(2011, 3, 5));
            const dr = moment.range(d1, d2);

            expect(dr.center().valueOf()).to.equal(1300622400000);
        });
    });
});
