'use strict';

/**
 * Expose `Format`.
 */
module.exports = Format;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new Format data interpreter.
 */
function Format() {
}

utils.extend(Abstract, Format);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Format.prototype, 'order', {
    value: 1200
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Format.prototype.interpret = function(name, value, contract, parameters) {
    // Format the value.
    if (null != value && contract.format) {
        Object.checkType(contract.format, 'function');

        var formattedValue = contract.format(value, parameters);

        if (null != formattedValue) {
            value = formattedValue;
        }
    }

    return value;
}