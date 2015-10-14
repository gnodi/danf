'use strict';

/**
 * Expose `Result`.
 */
module.exports = Result;

/**
 * Initialize a new result asynchronous callback.
 */
function Result() {
}

Result.defineImplementedInterfaces(['danf:manipulation.asynchronousCallback']);

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
Result.prototype.execute = function(callback, error, result) {
    callback(result);
}

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
Result.prototype.wrap = function(callback) {
    return function(result) {
        callback(result);
    }
}