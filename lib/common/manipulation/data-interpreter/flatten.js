'use strict';

/**
 * Expose `Flatten`.
 */
module.exports = Flatten;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new flatten data interpreter.
 */
function Flatten() {
}

utils.extend(Abstract, Flatten);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Flatten.prototype, 'order', {
    value: 800
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Flatten.prototype.interpret = function(name, value, contract, parameters) {
    // Flatten the value with the given separator if defined.
    if (undefined !== contract.flatten && 'object' === typeof value) {
        if (null != contract.flatten) {
            Object.checkType(contract.flatten, 'boolean|string');
        }

    	var separator = contract.flatten === true ? '.' : '' + contract.flatten;

    	value = utils.flatten(value, 100, separator);
    }

    return value;
}