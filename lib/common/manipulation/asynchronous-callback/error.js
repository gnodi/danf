'use strict';

/**
 * Expose `Error`.
 */
module.exports = Error;

/**
 * Initialize a new error asynchronous callback.
 */
function Error() {
}

Error.defineImplementedInterfaces(['danf:manipulation.asynchronousCallback']);

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
Error.prototype.execute = function(callback, error, result) {
    callback(error);
}

/**
 * @interface {danf:manipulation.asynchronousCallback}
 */
Error.prototype.wrap = function(callback) {
    return function(error) {
        if (error instanceof Error) {
            throw error;
        }

        callback();
    }
}