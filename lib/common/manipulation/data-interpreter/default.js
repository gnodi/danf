'use strict';

/**
 * Expose `Default`.
 */
module.exports = Default;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new default data interpreter.
 */
function Default() {
}

utils.extend(Abstract, Default);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Default.prototype, 'order', {
    value: 1000
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Default.prototype.interpret = function(name, value, contract, parameters) {
    // Set the default value of the field if defined and no given value.
    if (
        (parameters.final || undefined === parameters.final) &&
        null == value &&
        undefined !== contract.default
    ) {
        value = 'object' === typeof contract.default
            ? utils.clone(contract.default)
            : contract.default
        ;
    }

    return value;
}