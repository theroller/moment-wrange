'use strict';

const moment = require('moment');
const Symbol = require('es6-symbol');

module.exports = byRange;

function byRange(stepRange, options = { exclusive: false, step: 1 }) {
    const range = this;
    const step = options.step || 1;
    const diff = this.valueOf() / stepRange.valueOf() / step;
    const exclusive = options.exclusive || false;
    const unit = Math.floor(diff);
    let iteration = 0;

    return {
        [Symbol.iterator]() {
            if (unit === Infinity) {
                return { done: true };
            }

            return {
                next() {
                    const current = moment(range.start.valueOf() + (stepRange.valueOf() * iteration * step));
                    const done = ((unit === diff) && exclusive)
                        ? !(iteration < unit)
                        : !(iteration <= unit);

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
