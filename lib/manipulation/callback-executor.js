'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
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

    /**
     * Expose `CallbackExecutor`.
     */
    return CallbackExecutor;
});