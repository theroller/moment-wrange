# Moment Range

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 4.0.5
* added bitHound badge

## 4.0.4
* broke up tests into individual files; need to expand on testing
* updated package-lock.json

## 4.0.1
* added npm badge
* dev dependencies
    * updated mocha to v5.x
    * updated karma to v2.x

## 4.0.0
* renamed to MomentWrange
* circleci support added

## 4.0.0-rc.3
* initial release of fork

## 4.0.0-rc.3

* Converted codebase to use ES5
* MIN\_MOMENT & MAX\_MOMENT are now module level properties
* Removed unused infrastructure
    * flow
    * yarn

## 4.0.0-rc.2

* Added MIN_MOMENT property
* Added MAX_MOMENT property
* Added invertRanges method
* Added mergeRanges method

## 4.0.0-rc.1
### Changed

* Dev Dependecy updates
  * babel-eslint
  * babel-loader
  * babel-preset-es2015 => babel-preset-env
  * eslint
  * flow-bin
  * mocha
  * webpack
* Linting cleanup
* Test cleanup
  * added mocha-webpack to all for non-browser based testing
  * Chrome tests are now headless
* API changes
  * adjacent: accepts units
  * add: accepts options object and defaults to allowing adjacent ranges
  * contains: replaced options object with units and inclusivity arguments to better match moment.js' functionality. **This is a breaking change.**
  * toString: accepts a format string to control output

### Changed

* Documentation
* Changed usage:
    import Moment from 'moment';
    import { DateRange, extendMoment } from 'moment-js';
    const moment = extendMoment(Moment);
* Pass additonal optional rounded argument in `diff` (#104)
* Updated short-hand units (#134)
* Updated packaging rules and scripts
* Iteration methods now return an `Iterator`
* `dist/` is only included in the npm release now

### Removed

* Removed bower
* Removed grunt
* Removed jshint
* Removed mocha/should
* Removed `toArray`

### Fixed

* Fixed issue with `moment#within` and moment-timezone (#127)
* Fixed typo in comment (#133)

[Unreleased]: https://github.com/theroller/moment-wrange/compare/v3.0.3...HEAD
