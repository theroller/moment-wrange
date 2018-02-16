'use strict';

const moment = require('moment');
const Symbol = require('es6-symbol');

module.exports = reverseBy;

function reverseBy(units, options = { exclusive: false, step: 1 }) {
    const range = this;
    units = moment.normalizeUnits(units);

    return {
        [Symbol.iterator]() {
            const exclusive = options.exclusive || false;
            const step = options.step || 1;
            const diff = Math.abs(range.start.diff(range.end, units)) / step;
            let iteration = 0;

            return {
                next() {
                    const current = range.end.clone().subtract((iteration * step), units);
                    const done = exclusive
                        ? !(iteration < diff)
                        : !(iteration <= diff);

                    iteration++;

                    return {
                        done,
                        value: (done ? undefined : current)
                    };
                }
            };
        }
    };
}
