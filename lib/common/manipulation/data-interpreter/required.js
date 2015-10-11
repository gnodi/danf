'use strict';

/**
 * Expose `Required`.
 */
module.exports = Required;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new required data interpreter.
 */
function Required() {
}

utils.extend(Abstract, Required);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Required.prototype, 'order', {
    value: 1400
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Required.prototype.interpret = function(name, value, contract, parameters) {
    // Check the required state of the field if no given value.
    if (
        (parameters.final || undefined === parameters.final) &&
        null == value &&
        contract.required
    ) {
        throw new Error(
            'The value is required for the field "{0}".'.format(
                name
            )
        );
    }

    return value;
}