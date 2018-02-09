'use strict';

module.exports = overlaps;

function overlaps(other, options = { adjacent: false }) {
    return (options.adjacent && this.adjacent(other)) || (this.intersect(other) !== null);
}
