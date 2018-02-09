'use strict';

const Symbol = require('es6-symbol');

module.exports = reverseBy;

function reverseBy(interval, options = { exclusive: false, step: 1 }) {
    const range = this;

    return {
        [Symbol.iterator]() {
            const exclusive = options.exclusive || false;
            const step = options.step || 1;
            const diff = Math.abs(range.start.diff(range.end, interval)) / step;
            let iteration = 0;

            return {
                next() {
                    const current = range.end.clone().subtract((iteration * step), interval);
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
