'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('-/danf/lib/common/utils') : require('../../utils'),
        Abstract = module.isClient ? require('-/danf/lib/common/manipulation/data-interpreter/abstract') : require('./abstract')
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
        if (null != contract.flatten) {
            Object.checkType(contract.flatten, 'boolean|string');
        }

        // Flatten the value with the given separator if defined.
        if (undefined !== contract.flatten && 'object' === typeof value) {
        	var separator = contract.flatten === true ? '.' : '' + contract.flatten;

        	value = utils.flatten(value, 100, separator);
        }

        return value;
    }

    /**
     * Expose `Flatten`.
     */
    return Flatten;
});