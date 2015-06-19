'use strict';

/**
 * Expose `Key`.
 */
module.exports = Key;

/**
 * Initialize a new key asynchronous iterator.
 */
function Key() {
}

Key.defineImplementedInterfaces(['danf:manipulation.asynchronousIterator']);

/**
 * @interface {danf:manipulation.asynchronousIterator}
 */
Key.prototype.wrap = function(iterator) {
    return function(item, key, callback) {
        iterator({
            item: item,
            key: key,
            callback: callback
        });
    }
}