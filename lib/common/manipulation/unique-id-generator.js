'use strict';

/**
 * Expose `UniqueIdGenerator`.
 */
module.exports = UniqueIdGenerator;

/**
 * Initialize a new unique id generator.
 */
function UniqueIdGenerator() {}

UniqueIdGenerator.defineImplementedInterfaces(['danf:manipulation.uniqueIdGenerator']);

/**
 * @interface {danf:manipulation.uniqueIdGenerator}
 */
UniqueIdGenerator.prototype.generate = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r&0x3 | 0x8)
        ;

        return v.toString(16);
    });
}