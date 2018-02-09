'use strict';

const Symbol = require('es6-symbol');

module.exports = by;

function by(interval, options = { exclusive: false, step: 1 }) {
    const range = this;

    return {
        [Symbol.iterator]() {
            const exclusive = options.exclusive || false;
            const step = options.step || 1;
            const diff = Math.abs(range.start.diff(range.end, interval)) / step;
            let iteration = 0;

            return {
                next() {
                    const current = range.start.clone().add((iteration * step), interval);
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
