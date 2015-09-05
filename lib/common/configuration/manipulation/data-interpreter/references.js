'use strict';

/**
 * Expose `References`.
 */
module.exports = References;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    Abstract = require('./abstract-namespacer')
;

/**
 * Initialize a new section interpreter references for the config.
 */
function References() {
    Abstract.call(this);
}

utils.extend(Abstract, References);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(References.prototype, 'handles', {
    value: 'References'
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(References.prototype, 'order', {
    value: 1300
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
References.prototype.interpret = function(name, value, contract, parameters) {
    if (null != contract.references) {
        Object.checkType(contract.references, 'string_array');
    }

    // Prefix the references with the namespace.
    if (null != value && contract.references) {
        for (var i = 0; i < contract.references.length; i++) {
            value = this._namespacer.prefixReferences(
                value,
                contract.references[i],
                parameters.module,
                parameters.modulesTree
            );
        }
    }

    return value;
}