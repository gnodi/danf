'use strict';

/**
 * Expose `Memo`.
 */
module.exports = Memo;

/**
 * Initialize a new memo asynchronous iterator.
 */
function Memo() {
}

Memo.defineImplementedInterfaces(['danf:manipulation.asynchronousIterator']);

/**
 * @interface {danf:manipulation.asynchronousIterator}
 */
Memo.prototype.wrap = function(iterator) {
    return function(memo, item, callback) {
        iterator({
            item: item,
            memo: memo,
            callback: callback
        });
    }
}