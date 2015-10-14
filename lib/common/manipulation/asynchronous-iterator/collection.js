'use strict';

/**
 * Expose `Collection`.
 */
module.exports = Collection;

/**
 * Initialize a new collection asynchronous iterator.
 */
function Collection() {
}

Collection.defineImplementedInterfaces(['danf:manipulation.asynchronousIterator']);

/**
 * @interface {danf:manipulation.asynchronousIterator}
 */
Collection.prototype.wrap = function(iterator) {
    return function(item, callback) {
        iterator({
            item: item,
            callback: callback
        });
    }
}