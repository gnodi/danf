'use strict';

/**
 * Expose `Array_`.
 */
module.exports = Array_;

/**
 * Initialize a new array asynchronous input.
 */
function Array_() {
}

Array_.defineImplementedInterfaces(['danf:manipulation.asynchronousInput']);

/**
 * @interface {danf:manipulation.asynchronousInput}
 */
Array_.prototype.format = function(input) {
    if ('object' === typeof input && !Array.isArray(input)) {
        var formattedInput = [];

        for (var key in input) {
            formattedInput.push(input[key]);
        }

        input = formattedInput;
    }

    try {
        Object.checkType(input, 'array');
    } catch (error) {
        if (error.instead) {
            error.message = 'The input of the collection should be {0}; {1} given instead.'.format(
                error.expected,
                error.instead
            );
        }

        throw error;
    }

    return input;
}