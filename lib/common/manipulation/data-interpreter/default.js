'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
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
        if (!parameters.disableDefault && null == value && undefined !== contract.default) {
            value = contract.default;
        }

        return value;
    }

    /**
     * Expose `Default`.
     */
    return Default;
});