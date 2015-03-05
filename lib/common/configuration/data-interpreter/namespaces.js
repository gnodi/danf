'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('-/danf/utils') : require('../../../utils'),
        Abstract = module.isClient ? require('-/danf/lib/common/configuration/data-interpreter/abstract-namespacer') : require('./abstract-namespacer')
    ;

    /**
     * Initialize a new section interpreter namespaces for the config.
     *
     * @param {danf:configuration.namespacer} namespacer The namespacer.
     */
    function Namespaces(namespacer) {
        Abstract.call(this, namespacer);
    }

    utils.extend(Abstract, Namespaces);

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Object.defineProperty(Namespaces.prototype, 'handles', {
        value: 'namespaces'
    });

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Object.defineProperty(Namespaces.prototype, 'order', {
        value: 1300
    });

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Namespaces.prototype.interpret = function(name, value, contract, parameters) {
        if (null != contract.namespaces) {
            Object.checkType(contract.namespaces, 'boolean|string_array');
        }

        // Prefix with the namespace.
        if (null != value && contract.namespaces) {
            var namespaces = contract.namespaces,
                processValue = true
            ;

            if (Array.isArray(namespaces)) {
                var type = Object.getType(value);

                processValue = false;

                for (var i = 0; i < namespaces.length; i++) {
                    if (type === namespaces[i]) {
                        processValue = true;
                    }

                    if ('object' === namespaces[i]) {
                        namespaces = true;
                    }
                }
            }

            if (processValue) {
                if (
                    true === namespaces &&
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

                if (true !== namespaces || contract.namespaces.length > 1) {
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

    /**
     * Expose `Namespaces`.
     */
    return Namespaces;
});