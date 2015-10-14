'use strict';

/**
 * Expose `FlowDriver`.
 */
module.exports = FlowDriver;

/**
 * Initialize a new flow driver.
 * This is a proxy of the async lib (https://github.com/caolan/async).
 */
function FlowDriver() {
}

FlowDriver.defineImplementedInterfaces(['danf:manipulation.flowDriver']);

FlowDriver.defineDependency('_async', 'object');

/**
 * Async lib.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(FlowDriver.prototype, 'async', {
    set: function(async) { this._async = async; }
});

// Collections (https://github.com/caolan/async#collections-1)
/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.each = function(arr, iterator, callback) {
    return this._async.each(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.eachSeries = function(arr, iterator, callback) {
    return this._async.eachSeries(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.eachLimit = function(arr, limit, iterator, callback) {
    return this._async.eachLimit(arr, limit, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.forEachOf = function(obj, iterator, callback) {
    return this._async.forEachOf(obj, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.forEachOfSeries = function(obj, iterator, callback) {
    return this._async.forEachOfSeries(obj, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.forEachOfLimit = function(obj, limit, iterator, callback) {
    return this._async.forEachOfLimit(obj, limit, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.map = function(arr, iterator, callback) {
    return this._async.map(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.mapSeries = function(arr, iterator, callback) {
    return this._async.mapSeries(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.mapLimit = function(arr, limit, iterator, callback) {
    return this._async.mapLimit(arr, limit, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.filter = function(arr, iterator, callback) {
    return this._async.filter(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.filterSeries = function(arr, iterator, callback) {
    return this._async.filterSeries(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.reject = function(arr, iterator, callback) {
    return this._async.reject(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.rejectSeries = function(arr, iterator, callback) {
    return this._async.rejectSeries(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.reduce = function(arr, memo, iterator, callback) {
    return this._async.reduce(arr, memo, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.reduceRight = function(arr, memo, iterator, callback) {
    return this._async.reduceRight(arr, memo, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.detect = function(arr, iterator, callback) {
    return this._async.detect(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.detectSeries = function(arr, iterator, callback) {
    return this._async.detectSeries(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.sortBy = function(arr, iterator, callback) {
    return this._async.sortBy(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.some = function(arr, iterator, callback) {
    return this._async.some(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.every = function(arr, iterator, callback) {
    return this._async.every(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.concat = function(arr, iterator, callback) {
    return this._async.concat(arr, iterator, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.concatSeries = function(arr, iterator, callback) {
    return this._async.concatSeries(arr, iterator, callback);
}

// Control Flow (https://github.com/caolan/async#control-flow-1)
/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.series = function(tasks, callback) {
    return this._async.series(tasks, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.parallel = function(tasks, callback) {
    return this._async.parallel(tasks, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.parallelLimit = function(tasks, limit, callback) {
    return this._async.parallelLimit(tasks, limit, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.whilst = function(test, fn, callback) {
    return this._async.whilst(test, fn, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.doWhilst = function(fn, test, callback) {
    return this._async.doWhilst(fn, test, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.until = function(test, fn, callback) {
    return this._async.until(test, fn, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.doUntil = function(fn, test, callback) {
    return this._async.doUntil(fn, test, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.forever = function(fn, errback) {
    return this._async.forever(fn, errback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.waterfall = function(tasks, callback) {
    return this._async.waterfall(tasks, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.compose = function() {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.compose.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.seq = function() {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.seq.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.applyEach = function(/*fns, args..., callback*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.applyEach.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.applyEachSeries = function(/*fns, args..., callback*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.applyEachSeries.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.queue = function(worker, concurrency) {
    return this._async.queue(worker, concurrency);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.priorityQueue = function(worker, concurrency) {
    return this._async.priorityQueue(worker, concurrency);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.cargo = function(worker, payload) {
    return this._async.cargo(worker, payload);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.auto = function(tasks, callback) {
    return this._async.auto(tasks, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.retry = function(times, tasks, callback) {
    return this._async.retry(times, tasks, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.iterator = function(tasks) {
    return this._async.iterator(tasks);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.apply = function(/*function, arguments...*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.apply.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.nextTick = function(callback) {
    return this._async.nextTick(callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.setImmediate = function(callback) {
    return this._async.setImmediate(callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.times = function(n, callback) {
    return this._async.times(n, callback);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.timesSeries = function(n, callback) {
    return this._async.timesSeries(n, callback);
}

// Utils (https://github.com/caolan/async#utils-1)
/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.memoize = function(fn, hasher) {
    return this._async.memoize(fn, hasher);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.unmemoize = function(fn) {
    return this._async.unmemoize(fn);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.log = function(/*function, arguments...*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.log.apply(this, args);
}

/**
 * @interface {danf:manipulation.flowDriver}
 */
FlowDriver.prototype.dir = function(/*function, arguments...*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this._async.dir.apply(this, args);
}