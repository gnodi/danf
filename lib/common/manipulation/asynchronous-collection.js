'use strict';

/**
 * Expose `AsynchronousCollection`.
 */
module.exports = AsynchronousCollection;

/**
 * Initialize a new asynchronous collection.
 */
function AsynchronousCollection() {
    this._parameters = {};
}

AsynchronousCollection.defineImplementedInterfaces(['danf:manipulation.asynchronousCollection']);

AsynchronousCollection.defineDependency('_method', 'string');
AsynchronousCollection.defineDependency('_alias', 'string|null');
AsynchronousCollection.defineDependency('_parameters', 'mixed_object');
AsynchronousCollection.defineDependency('_input', 'danf:manipulation.asynchronousInput');
AsynchronousCollection.defineDependency('_iterator', 'danf:manipulation.asynchronousIterator');
AsynchronousCollection.defineDependency('_callback', 'danf:manipulation.asynchronousCallback');

/**
 * Async method name.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'method', {
    set: function(method) { this._method = method; },
    get: function() { return this._method; }
});

/**
 * Optional alias name.
 *
 * @var {string|null}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'alias', {
    set: function(alias) { this._alias = alias; },
    get: function() { return this._alias; }
});

/**
 * Parameters.
 *
 * @var {mixed_object}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; },
    get: function() { return this._parameters; }
});

/**
 * Input type.
 *
 * @var {danf:manipulation.asynchronousInput}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'input', {
    set: function(input) { this._input = input; }
});

/**
 * Iterator.
 *
 * @var {danf:manipulation.asynchronousIterator}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'iterator', {
    set: function(iterator) { this._iterator = iterator; }
});

/**
 * Callback.
 *
 * @var {danf:manipulation.asynchronousCallback}
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'callback', {
    set: function(callback) { this._callback = callback; }
});

/**
 * @interface {danf:manipulation.asynchronousCollection}
 */
AsynchronousCollection.prototype.formatInput = function(input) {
    return this._input.format(input);
}

/**
 * @interface {danf:manipulation.asynchronousCollection}
 */
AsynchronousCollection.prototype.wrapIterator = function(iterator) {
    return this._iterator.wrap(iterator);
}

/**
 * @interface {danf:manipulation.asynchronousCollection}
 */
AsynchronousCollection.prototype.executeIteratorCallback = function(callback, error, result) {
    this._callback.execute(callback, error, result);
}

/**
 * @interface {danf:manipulation.asynchronousCollection}
 */
AsynchronousCollection.prototype.wrapCallback = function(callback) {
    return this._callback.wrap(callback);
}