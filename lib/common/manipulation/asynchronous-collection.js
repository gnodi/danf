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
 * Get/set the async method name.
 *
 * @param {string} method The async method.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'method', {
    set: function(method) { this._method = method; },
    get: function() { return this._method; }
});

/**
 * Get/set the optional alias name.
 *
 * @param {string|null} alias The alias.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'alias', {
    set: function(alias) { this._alias = alias; },
    get: function() { return this._alias; }
});

/**
 * Get/set the parameters.
 *
 * @param {mixed_object} parameters The parameters.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; },
    get: function() { return this._parameters; }
});

/**
 * Set the input type.
 *
 * @param {danf:manipulation.asynchronousInput} input The input type.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'input', {
    set: function(input) { this._input = input; }
});

/**
 * Set the iterator.
 *
 * @param {danf:manipulation.asynchronousIterator} iterator The asynchronous iterator.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'iterator', {
    set: function(iterator) { this._iterator = iterator; }
});

/**
 * Set the callback.
 *
 * @param {danf:manipulation.asynchronousCallback} callback The asynchronous callback.
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