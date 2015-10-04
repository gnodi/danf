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
    value: 1400
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Format.prototype.interpret = function(name, value, contract, parameters) {
    if (null != value) {
        if (null != contract.format) {
            Object.checkType(contract.format, 'function');
        }

        // Format the value.
        if (contract.format) {
            var formattedValue = contract.format(value);

            if (null != formattedValue) {
                value = formattedValue;
            }
        }
    }

    return value;
}