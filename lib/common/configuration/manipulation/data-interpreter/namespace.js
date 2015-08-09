'use strict';

/**
 * Expose `Namespace`.
 */
module.exports = Namespace;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    Abstract = require('./abstract-namespacer')
;

/**
 * Initialize a new section interpreter namespace for the config.
 *
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function Namespace(namespacer) {
    Abstract.call(this, namespacer);
}

utils.extend(Abstract, Namespace);

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Namespace.prototype, 'handles', {
    value: 'namespace'
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(Namespace.prototype, 'order', {
    value: 1300
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Namespace.prototype.interpret = function(name, value, contract, parameters) {
    if (null != contract.namespace) {
        Object.checkType(contract.namespace, 'boolean|string_array');
    }

    // Prefix with the namespace.
    if (null != value && contract.namespace) {
        var namespace = contract.namespace,
            processValue = true
        ;

        if (Array.isArray(namespace)) {
            var type = Object.getType(value);

            processValue = false;

            for (var i = 0; i < namespace.length; i++) {
                if (type === namespace[i]) {
                    processValue = true;
                }

                if ('object' === namespace[i]) {
                    namespace = true;
                }
            }
        }

        if (processValue) {
            if (
                true === namespace &&
                'object' === typeof value &&
                !Array.isArray(value) &&
                !(value instanceof Date)
            ) {
                for (var key in value) {
                    var prefixedKey = this._namespacer.prefix(key, parameters.module, parameters.modulesTree);

                    if (key !== prefixedKey) {
                        value[prefixedKey] = value[key];
                        delete value[key];
                    }
                }
            } else {
                value = prefixStrings.call(this, value, parameters.module, parameters.modulesTree, true);
            }

            if (true !== namespace || contract.namespace.length > 1) {
                value = prefixStrings.call(this, value, parameters.module, parameters.modulesTree, true);
            }
        }
    }

    // Check for individual fields needing to be prefixed.
    value = prefixStrings.call(this, value, parameters.module, parameters.modulesTree, false);

    return value;
}

/**
 * Prefix the strings in a value.
 *
 * @param mixed value The value.
 * @param boolean prefixAll Force the prefixing of all strings.
 * @param {danf:configuration.module} dependency The dependency module.
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @return mixed The value with prefixed strings.
 * @api private
 */
var prefixStrings = function(value, module, modulesTree, prefixAll) {
    if (
        'string' === typeof value &&
        (prefixAll || '[-]' === value.substr(0, 3))
    ) {
        value = this._namespacer.prefix(
            prefixAll ? value : value.substr(3),
            module,
            modulesTree
        );
    } else if ('object' === typeof value) {
        for (var key in value) {
            value[key] = prefixStrings.call(this, value[key], module, modulesTree, prefixAll);
        }
    }

    return value;
}