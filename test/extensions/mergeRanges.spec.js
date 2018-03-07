'use strict';

const { expect } = require('chai');
const { extendMoment } = require('../../src');
const moment = extendMoment(require('moment'));


describe('moment().mergeRanges()', function() {

    describe('ascending ordered input ranges', function() {

        it('should not merge ranges, a===a b===b c===c', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-03-01', '2000-03-31');
            const c = moment.range('2000-05-01', '2000-05-31');

            const result = moment().mergeRanges([a, b, c]);

            expect(result).to.have.length(3);
            expect(result[0]).to.equal(a);
            expect(result[1]).to.equal(b);
            expect(result[2]).to.equal(c);
        });

        it('should only merge a+b, a==b=a==b c===c', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-15', '2000-03-31');
            const c = moment.range('2000-05-01', '2000-05-31');

            const result = moment().mergeRanges([a, b, c]);

            expect(result).to.have.length(2);
            expect(result[0]).to.eql(moment.range(a.start, b.end));
            expect(result[1]).to.equal(c);
        });

        it('should only merge b+c, a===a b==c=b==c', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-03-01', '2000-03-31');
            const c = moment.range('2000-03-15', '2000-05-31');

            const result = moment().mergeRanges([a, b, c]);

            expect(result).to.have.length(2);
            expect(result[0]).to.equal(a);
            expect(result[1]).to.eql(moment.range(b.start, c.end));
        });

        it('should merge a+b+c, a==b=a=c=b==c', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-15', '2000-02-15');
            const c = moment.range('2000-02-01', '2000-03-01');

            const result = moment().mergeRanges([a, b, c]);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, c.end));
        });

        it('should merge a+b+c, a==b=a=c===c=b', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-15', '2000-06-01');
            const c = moment.range('2000-02-01', '2000-03-01');

            const result = moment().mergeRanges([a, b, c]);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, b.end));
        });

        it('should merge a+b, a===ab===b', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-31', '2000-03-01');

            const result = moment().mergeRanges([a, b]);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, b.end));
        });

        it('should remove empty range b, a===a  b', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-02-22', '2000-02-22');

            const result = moment().mergeRanges([a, b]);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, a.end));
        });
    });

    describe('descending order input array', function() {
        it('should not merge ranges, a===a b===b c===c AND not change the input array', function() {
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

        it('should only merge a+b, a==b=a==b c===c AND not change the input array', function() {
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

        it('should only merge b+c, a===a b==c=b==c AND not change the input array', function() {
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

        it('should merge a+b+c, a==b=a=c=b==c AND not change the input array', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-15', '2000-02-15');
            const c = moment.range('2000-02-01', '2000-03-01');

            const array = [c, b, a];
            const result = moment().mergeRanges(array);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, c.end));
            expect(array, 'array input should be unmodified').to.eql([c, b, a]);
        });

        it('should merge a+b+c, a==b=a=c===c=b AND not change the input array', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-15', '2000-06-01');
            const c = moment.range('2000-02-01', '2000-03-01');

            const array = [c, b, a];
            const result = moment().mergeRanges(array);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, b.end));
            expect(array, 'array input should be unmodified').to.eql([c, b, a]);
        });

        it('should merge a+b, a===ab===b AND not change the input array', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-01-31', '2000-03-01');

            const array = [b, a];
            const result = moment().mergeRanges(array);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, b.end));
            expect(array, 'array input should be unmodified').to.eql([b, a]);
        });

        it('should remove empty range b, a===a  b AND not change the input array', function() {
            const a = moment.range('2000-01-01', '2000-01-31');
            const b = moment.range('2000-02-22', '2000-02-22');

            const array = [b, a];
            const result = moment().mergeRanges(array);

            expect(result).to.have.length(1);
            expect(result[0]).to.eql(moment.range(a.start, a.end));
            expect(array, 'array input should be unmodified').to.eql([b, a]);
        });
    });
});
