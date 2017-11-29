import moment from 'moment';
import Symbol from 'es6-symbol';
import isUndefined from 'moment/src/lib/utils/is-undefined';

//-----------------------------------------------------------------------------
// Constants
//-----------------------------------------------------------------------------

const INTERVALS = {
  year: true,
  quarter: true,
  month: true,
  week: true,
  day: true,
  hour: true,
  minute: true,
  second: true
};


//-----------------------------------------------------------------------------
// Date Ranges
//-----------------------------------------------------------------------------

export class DateRange {
  constructor(start, end) {
    let s = start;
    let e = end;

    if (arguments.length === 1 || end === undefined) {
      if (typeof start === 'object' && start.length === 2) {
        [s, e] = start;
      }
      else if (typeof start === 'string') {
        [s, e] = start.split('/');
      }
    }

    this.start = (s === null) ? moment(-8640000000000000) : moment(s);
    this.end = (e === null) ? moment(8640000000000000) : moment(e);

    if (this.start.isAfter(this.end))
      throw new Error('start must preceed end');
  }

  adjacent(other, units) {
    return (this.intersect(other) === null) && this.start.isSame(other.end, units) || this.end.isSame(other.start, units);
  }

  add(other, options = { adjacent: true }) {
    if (this.overlaps(other, options)) {
      return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
    }

    return null;
  }

  by(interval, options = { exclusive: false, step: 1 }) {
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

  byRange(interval, options = { exclusive: false, step: 1 }) {
    const range = this;
    const step = options.step || 1;
    const diff = this.valueOf() / interval.valueOf() / step;
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
            const current = moment(range.start.valueOf() + (interval.valueOf() * iteration * step));
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

  center() {
    const center = this.start.valueOf() + this.diff() / 2;

    return moment(center);
  }

  clone() {
    return new this.constructor(this.start, this.end);
  }

  contains(other, units, inclusivity) {
    // Default to inclusive
    inclusivity = inclusivity || '[]';

    const { start, end } = valueOfRange(this, units);

    let oStart;
    let oEnd;

    if (other instanceof DateRange) {
      oStart = other.start.valueOf();
      oEnd = other.end.valueOf();
    }
    else {
      oStart = other.valueOf();
      oEnd = other.valueOf();
    }

    const startInRange = (inclusivity[0] === '[') ? start <= oStart : start < oStart;
    const endInRange = (inclusivity[1] === ']') ? end >= oEnd : end > oEnd;

    return (startInRange && endInRange);
  }

  diff(unit, rounded) {
    return this.end.diff(this.start, unit, rounded);
  }

  duration(unit, rounded) {
    return this.diff(unit, rounded);
  }

  intersect(other) {
    const { start, end } = valueOfRange(this);
    const { start: oStart, end: oEnd } = valueOfRange(other);

    // this          [------------]
    // other {------------------------}
    // int           |============|
    if ((oStart < start) && (oEnd >= end)) {
      return this;
    }

    // this  [------------------------]
    // other         {------------}
    // int           |============|
    if ((start <= oStart) && (end >= oEnd)) {
      return other;
    }

    // this  [------------------------]
    // other                 {------------}
    // int                   |========|
    if ((start <= oStart) && (end > oStart) && (end <= oEnd)) {
      return new this.constructor(oStart, end);
    }

    // this                  [------------]
    // other {------------------------}
    // int                   |========|
    if ((oStart < start) && (oEnd > start) && (oEnd <= end)) {
      return new this.constructor(start, oEnd);
    }

    return null;
  }

  isEqual(other, units) {
    return this.start.isSame(other.start, units) && this.end.isSame(other.end, units);
  }

  isSame(other, units) {
    return this.isEqual(other, units);
  }

  overlaps(other, options = { adjacent: false }) {
    return (options.adjacent && this.adjacent(other)) || (this.intersect(other) !== null);
  }

  reverseBy(interval, options = { exclusive: false, step: 1 }) {
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

  reverseByRange(interval, options = { exclusive: false, step: 1 }) {
    const range = this;
    const step = options.step || 1;
    const diff = this.valueOf() / interval.valueOf() / step;
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
            const current = moment(range.end.valueOf() - (interval.valueOf() * iteration * step));
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

  subtract(other) {
    const { start, end } = valueOfRange(this);
    const { start: oStart, end: oEnd } = valueOfRange(other);

    if (this.intersect(other) === null) {
      return [this];
    }

    if ((start >= oStart) && (end <= oEnd)) {
      return [];
    }

    if ((start >= oStart) && (start < oEnd) && (end > oEnd)) {
      return [new this.constructor(oEnd, end)];
    }

    if ((start < oStart) && (end > oStart) && (end <= oEnd)) {
      return [new this.constructor(start, oStart)];
    }

    if ((start < oStart) && (end > oEnd)) {
      return [new this.constructor(start, oStart), new this.constructor(oEnd, end)];
    }

    return [];
  }

  toDate() {
    return [this.start.toDate(), this.end.toDate()];
  }

  toString(format) {
    return this.start.format(format) + '/' + this.end.format(format);
  }

  valueOf() {
    return this.end.valueOf() - this.start.valueOf();
  }
}


//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(moment) {
  /**
   * Build a date range.
   */
  moment.range = function range(start, end) {
    const m = this;

    if (INTERVALS.hasOwnProperty(start)) {
      return new DateRange(moment(m).startOf(start), moment(m).endOf(start));
    }

    return new DateRange(start, end);
  };

  /**
   * Alias of static constructor.
   */
  moment.fn.range = moment.range;

  /**
   * Expose constructor
   */
  moment.range.constructor = DateRange;

  moment.fn.mergeRanges = mergeRanges;

  /**
   * Check if the current moment is within a given date range.
   */
  moment.fn.within = function(range) {
    return range.contains(this.toDate());
  };

  return moment;
}


/**
 * Generates a new array of ranges in ascending order where any
 * overlapping or adjacent ranges are merged.
 * @param {array} ranges - Array of moment-range objects
 */
function mergeRanges(ranges) {
  const chunks = [];
  let chunk = null;

  ranges
    .slice() // copy the ranges because we may have to sort them
    .sort((a, b) => a.start - b.start) // ranges must be in ascending order
    .forEach((range, index) => {
      if (typeof chunk === 'undefined' || chunk === null) {
        chunk = range;
      }
      else {
        if (range.overlaps(chunk, { adjacent: true })) {
          chunk = moment.range(moment.min(chunk.start, range.start), moment.max(chunk.end, range.end));
        }
        else {
          chunks.push(chunk);
          chunk = range;
        }
      }

      // Handle the end of the timeline
      if (index === ranges.length - 1) {
        chunks.push(chunk);
      }
    });

  return chunks;
}

function valueOfRange(range, units) {
  // Default to the full timestamp
  units = moment.normalizeUnits(isUndefined(units) ? 'millisecond' : units);

  let start;
  let end;

  if (units === 'millisecond') {
    start = range.start.valueOf();
    end = range.end.valueOf();
  }
  else {
    start = range.start.clone().startOf(units).valueOf();
    end = range.end.clone().endOf(units).valueOf();
  }

  return { start, end };
}
