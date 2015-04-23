'use strict';

/**
 * Expose `CallbackExecutor`.
 */
module.exports = CallbackExecutor;

/**
 * Initialize a new callback executor.
 */
function CallbackExecutor() {}

CallbackExecutor.defineImplementedInterfaces(['danf:manipulation.callbackExecutor']);

/**
 * @interface {danf:manipulation.callbackExecutor}
 */
CallbackExecutor.prototype.execute = function(callback) {
    var args = Array.prototype.slice.call(arguments, 1);

    return callback.apply(this, args);
}