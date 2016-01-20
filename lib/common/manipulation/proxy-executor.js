'use strict';

/**
 * Expose `ProxyExecutor`.
 */
module.exports = ProxyExecutor;

/**
 * Initialize a new proxy executor.
 */
function ProxyExecutor() {}

ProxyExecutor.defineImplementedInterfaces(['danf:manipulation.proxyExecutor']);

/**
 * @interface {danf:manipulation.proxyExecutor}
 */
ProxyExecutor.prototype.execute = function(object, method) {
    var args = Array.prototype.slice.call(arguments, 2);

    return object[method].apply(object, args);
}

/**
 * @interface {danf:manipulation.proxyExecutor}
 */
ProxyExecutor.prototype.executeAsync = function(object, method, scope) {
    var args = Array.prototype.slice.call(arguments, 3);

    return object[method].__asyncApply(object, scope || '.', args);
}