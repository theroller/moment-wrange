'use strict';

const { expect } = require('chai');
const { MAX_MOMENT, MIN_MOMENT } = require('../../src');


describe('properties', function() {

    it('MAX_MOMENT = 8640000000000000 milliseconds', function() {
        expect(MAX_MOMENT.valueOf()).to.equal(8640000000000000);
    });

    it('MIN_MOMENT = -8640000000000000 milliseconds', function() {
        expect(MIN_MOMENT.valueOf()).to.equal(-8640000000000000);
    });
});
