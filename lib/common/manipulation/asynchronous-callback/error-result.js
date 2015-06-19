'use strict';

/**
 * Expose `ErrorResult`.
 */
module.exports = ErrorResult;

/**
 * Initialize a new error result asynchronous callback.
 */
function ErrorResult() {
}

ErrorResult.defineImplementedInterfaces(['danf:manipulation.asynchronousCallback']);

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
ErrorResult.prototype.execute = function(callback, error, result) {
    callback(error, result);
}

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
ErrorResult.prototype.wrap = function(callback) {
    return function(error, result) {
        if (error instanceof ErrorResult) {
            throw error;
        }

        callback(result);
    }
}