'use strict';

const MomentWrange = require('../index');

module.exports = isRange;

function isRange(obj) {
    return obj instanceof MomentWrange;
}
