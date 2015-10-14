'use strict';

module.exports = CallbackExecutor;

function CallbackExecutor() {}

CallbackExecutor.defineImplementedInterfaces(['danf:manipulation.callbackExecutor']);

CallbackExecutor.prototype.execute = function(callback) {
    var args = Array.prototype.slice.call(arguments, 1);

    return callback.apply(this, args);
}

CallbackExecutor.prototype.executeCallback = function(callback) {
    return this.execute.apply(this, arguments);
}