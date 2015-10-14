'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract data interpreter.
 */
function Abstract() {
}

Abstract.defineImplementedInterfaces(['danf:manipulation.dataInterpreter']);

Abstract.defineAsAbstract();

/**
 * Data resolver.
 *
 * @var {danf:manipulation.dataResolver}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'dataResolver', {
    set: function(dataResolver) {
        this._dataResolver = dataResolver
    }
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Abstract.prototype.formatContract = function(contract) {
    return contract;
}

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Abstract.prototype.merge = function(name, value, value1, value2, contract, erase, parameters) {
    return value;
}

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Abstract.prototype.interpret = function(name, value, contract, parameters) {
    return value;
}