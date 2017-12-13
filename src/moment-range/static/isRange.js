'use strict';

const MomentRange = require('../index');

module.exports = isRange;

function isRange(obj) {
    return obj instanceof MomentRange;
}
