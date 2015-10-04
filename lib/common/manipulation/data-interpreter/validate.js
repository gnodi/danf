'use strict';

/**
 * Expose `Validate`.
 */
module.exports = Validate;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new Validate data interpreter.
 */
function Validate() {
}

utils.extend(Abstract, Validate);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Validate.prototype, 'order', {
    value: 1800
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Validate.prototype.interpret = function(name, value, contract, parameters) {
    if (null != value) {
        if (null != contract.validate) {
            Object.checkType(contract.validate, 'function');
        }

        // Validate the value.
        if (contract.validate) {
            try {
                var validatedValue = contract.validate(value);
            } catch (error) {
                throw new Error(
                    'The expected value for "{0}" is {1}; {2} given instead.'.format(
                        name,
                        error.message,
                        Object.getTypeString(value, true)
                    )
                );
            }

            if (null != validatedValue) {
                value = validatedValue;
            }
        }
    }

    return value;
}