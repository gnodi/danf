'use strict';

/**
 * Expose `AsynchronousCollection`.
 */
module.exports = AsynchronousCollection;

/**
 * Initialize a new asynchronous collection.
 *
 * @param {danf:manipulation.asynchronousIterator} iterator The asynchronous iterator.
 * @param {danf:manipulation.asynchronousCallback} callback The asynchronous callback.
 */
function AsynchronousCollection(iterator, callback) {
    this._parameters = {};
    if (iterator) {
        this.iterator = iterator;
    }
    if (callback) {
        this.callback = callback;
    }
}

AsynchronousCollection.defineImplementedInterfaces(['danf:manipulation.asynchronousCollection']);

AsynchronousCollection.defineDependency('_parameters', 'object');
AsynchronousCollection.defineDependency('_iterator', 'danf:manipulation.asynchronousIterator');
AsynchronousCollection.defineDependency('_callback', 'danf:manipulation.asynchronousCallback');

/**
 * Get/set the parameters.
 *
 * @param {number_object} parameters The parameters.
 * @api public
 */
Object.defineProperty(AsynchronousCollection.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; },
    get: function() { return this._parameters; }
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
AsynchronousCollection.prototype.wrapIterator = function(error, result, callback) {
    return this._iterator.wrap(error, result, callback);
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