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
     * Initialize a new required data interpreter.
     */
    function Required() {
    }

    utils.extend(Abstract, Required);

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Object.defineProperty(Required.prototype, 'order', {
        value: 1200
    });

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Required.prototype.interpret = function(name, value, contract, parameters) {
        if (null != contract.required) {
            Object.checkType(contract.required, 'boolean');
        }

        // Check the required state of the field if no given value.
        if (!parameters.disableDefault && null == value && contract.required) {
            throw new Error(
                'The value is required for the field "{0}".'.format(
                    name
                )
            );
        }

        return value;
    }

    /**
     * Expose `Required`.
     */
    return Required;
});