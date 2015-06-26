'use strict';

/**
 * Expose `Object_`.
 */
module.exports = Object_;

/**
 * Initialize a new object asynchronous input.
 */
function Object_() {
}

Object_.defineImplementedInterfaces(['danf:manipulation.asynchronousInput']);

/**
 * @interface {danf:manipulation.asynchronousInput}
 */
Object_.prototype.format = function(input) {
    try {
        Object.checkType(input, 'object|array');
    } catch (error) {
        if (error.instead) {
            throw new Error('The input of the collection should be {0}; {1} given instead.'.format(
                error.expected,
                error.instead
            ));
        }

        throw error;
    }

    return input;
}