'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../utils'),
        Abstract = module.isClient ? require('danf/configuration/data-interpreter/abstract-namespacer') : require('./abstract-namespacer')
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
        // Prefix with the namespace.
        if (null != value && contract.namespaces) {
            if ('object' === typeof value && !Array.isArray(value) && !(value instanceof Date)) {
                for (var key in value) {
                    var prefixedKey = this._namespacer.prefix(key, parameters.module, parameters.modulesTree);

                    if (key !== prefixedKey) {
                        value[prefixedKey] = value[key];
                        delete value[key];
                    }
                }
            } else if ('string' === typeof value) {
                value = this._namespacer.prefix(value, parameters.module, parameters.modulesTree);
            } else {
                try {
                    Object.checkType(value, 'string_array');

                    for (var i = 0; i < value.length; i++) {
                        value[i] = this._namespacer.prefix(value[i], parameters.module, parameters.modulesTree);
                    }
                } catch (error) {
                    try {
                        Object.checkType(value, 'string_object');

                        for (var i = 0; i < value.length; i++) {
                            value[i] = this._namespacer.prefix(value[i], parameters.module, parameters.modulesTree);
                        }
                    } catch (error) {
                        throw new Error(
                            'You cannot namespaces the type "{0}".'.format(typeof value)
                        );
                    }
                }
            }
        }

        // Check for individual fields needing to be prefixed.
        if ('string' === typeof value && '[-]' === value.substr(0, 3)) {
            value = this._namespacer.prefix(value.substr(3), parameters.module, parameters.modulesTree);
        } else if ('object' === typeof value) {
            for (var key in value) {
                var field = value[key];

                if ('string' === typeof field && '[-]' === field.substr(0, 3)) {
                    value[key] = this._namespacer.prefix(field.substr(3), parameters.module, parameters.modulesTree);
                } else if ('object' === typeof field) {
                    for (var embeddedKey in field) {
                        var embeddedField = field[embeddedKey];

                        if ('string' === typeof embeddedField && '[-]' === embeddedField.substr(0, 3)) {
                            field[embeddedKey] = this._namespacer.prefix(embeddedField.substr(3), parameters.module, parameters.modulesTree);
                        }
                    }
                }
            }
        }

        return value;
    }

    /**
     * Expose `Namespaces`.
     */
    return Namespaces;
});