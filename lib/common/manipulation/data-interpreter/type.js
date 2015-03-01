'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../../utils'),
        Abstract = module.isClient ? require('danf/lib/common/manipulation/data-interpreter/abstract') : require('./abstract')
    ;

    /**
     * Initialize a new type data interpreter.
     */
    function Type() {
    }

    utils.extend(Abstract, Type);

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Object.defineProperty(Type.prototype, 'order', {
        value: 1400
    });

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Type.prototype.formatContract = function(contract) {
        if ('object' !== typeof contract) {
            throw new Error('The contract must be an object.');
        }

        var formattedContract = {};

        // "__any" field means a "*_object" instead of a standard "embedded" for the root.
        if (undefined !== contract['__any']) {
            formattedContract = 'embedded' === contract.type || !contract.type
                ? { type: 'embedded_object', embed: contract['__any'] }
                : 'embedded_array' === contract.type
                    ? { type: 'embedded_array_object', embed: contract['__any'] }
                    : { type: '{0}_object'.format(contract.type) }
            ;

            formattedContract = utils.merge(contract, formattedContract);
        } else {
            formattedContract = {type: 'embedded', embed: contract};
        }

        return formattedContract;
    }

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Type.prototype.merge = function(name, value, value1, value2, contract, erase, parameters) {
        var inConflict = false;

        if (undefined === value1 && undefined === value2) {
            return;
        }

        // Handle callback contract type case.
        if ('function' === typeof contract.type) {
            if (undefined !== value1 && undefined !== value2) {
                if (erase || value1 == value2) {
                    value = value2;
                } else {
                    inConflict = true;
                }
            } else if (undefined !== value1) {
                value = value1;
            } else {
                value = value2;
            }
        // Handle defined type case.
        } else {
            var type = contract.type;

            if (-1 !== type.indexOf('|')) {
                if (null == value2) {
                    type = Object.getType(value1);
                } else {
                    type = Object.getType(value2);

                    if (!erase && null != value1 && type !== Object.getType(value1)) {
                        inConflict = true;
                    }
                }
            }

            if (!inConflict) {
                switch (type) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                    case 'function':
                    case 'date':
                    case 'error':
                    case 'array':
                    case 'undefined':
                    case 'null':
                    case 'string_array':
                    case 'number_array':
                    case 'boolean_array':
                    case 'function_array':
                    case 'date_array':
                    case 'error_array':
                    case 'string_array_array':
                    case 'number_array_array':
                    case 'boolean_array_array':
                    case 'function_array_array':
                    case 'date_array_array':
                    case 'error_array_array':
                    case 'mixed_array_array':
                    case 'string_object_array':
                    case 'number_object_array':
                    case 'boolean_object_array':
                    case 'function_object_array':
                    case 'date_object_array':
                    case 'error_object_array':
                    case 'mixed_object_array':
                    case 'embedded_array':
                        if (undefined !== value1 && undefined !== value2) {
                            if (erase || value1 == value2) {
                                value = value2;
                            } else {
                                inConflict = true;
                            }
                        } else if (undefined !== value1) {
                            value = value1;
                        } else {
                            value = value2;
                        }

                        break;
                    case 'object':
                    case 'number_object':
                    case 'string_object':
                    case 'boolean_object':
                    case 'function_object':
                    case 'date_object':
                    case 'error_object':
                    case 'mixed_object':
                    case 'number_array_object':
                    case 'string_array_object':
                    case 'boolean_array_object':
                    case 'function_array_object':
                    case 'date_array_object':
                    case 'error_array_object':
                    case 'mixed_array_object':
                    case 'number_object_object':
                    case 'string_object_object':
                    case 'boolean_object_object':
                    case 'function_object_object':
                    case 'date_object_object':
                    case 'error_object_object':
                    case 'mixed_object_object':
                        var hasValue = false;
                        value = {};

                        if (value1) {
                            for (var key in value1) {
                                if (value2 && value2[key]) {
                                    if (erase) {
                                        value[key] = value2[key];
                                    } else {
                                        inConflict = true;
                                    }
                                } else {
                                    value[key] = value1[key];
                                }

                                hasValue = true;
                            }
                        }

                        if (value2) {
                            for (var key in value2) {
                                if (undefined === value[key]) {
                                    value[key] = value2[key];

                                    hasValue = true;
                                }
                            }
                        }

                        if (!hasValue && !value1 && !value2) {
                            value = null;
                        }

                        break;
                    case 'embedded':
                        var hasValue = false;
                        value = {};

                        for (var key in contract.embed) {
                            value[key] = this._dataResolver.merge(
                                (value1 === undefined ? value1 : value1[key]),
                                (value2 === undefined ? value2 : value2[key]),
                                contract.embed[key],
                                erase,
                                formatFieldName(name, key),
                                parameters,
                                false
                            );

                            if (null == value[key]) {
                                delete value[key];
                            }

                            hasValue = true;
                        }

                        if (!hasValue && !value1 && !value2) {
                            value = null;
                        }

                        break;
                    case 'embedded_object':
                        var hasValue = false;
                        value = {};

                        for (var mixedKey in value1) {
                            var item = value1[mixedKey];

                            value[mixedKey] = {};

                            for (var key in contract.embed) {
                                value[mixedKey][key] = item[key];
                            }

                            hasValue = true;
                        }

                        for (var mixedKey in value2) {
                            var item = value2[mixedKey];

                            if (!value[mixedKey]) {
                               value[mixedKey] = {};
                            }

                            for (var key in contract.embed) {
                                value[mixedKey][key] = this._dataResolver.merge(
                                    value[mixedKey][key],
                                    value2[mixedKey][key],
                                    contract.embed[key],
                                    erase,
                                    formatFieldName(name, mixedKey, key),
                                    parameters,
                                    false
                                );
                            }

                            hasValue = true;
                        }

                        if (!hasValue && !value1 && !value2) {
                            value = null;
                        }

                        break;
                    case 'embedded_array_object':
                        var hasValue = false;
                        value = {};

                        for (var mixedKey in value1) {
                            value[mixedKey] = value1[mixedKey];

                            hasValue = true;
                        }

                        for (var mixedKey in value2) {
                            if (value2[mixedKey]) {
                                if (value[mixedKey] && !erase) {
                                    inConflict = true;
                                } else {
                                    value[mixedKey] = value2[mixedKey];
                                }
                            }

                            hasValue = true;
                        }

                        if (!hasValue && !value1 && !value2) {
                            value = null;
                        }

                        break;
                    case 'mixed':
                        if (erase || value1 == value2) {
                            value = value2;

                            if (undefined === value) {
                                value = value1;
                            }
                        } else if (undefined === value1) {
                            value = value2;
                        } else if (undefined === value2) {
                            value = value1;
                        } else {
                            inConflict = true;
                        }

                        break;
                }
            }
        }

        if (inConflict) {
            throw new Error(
                'You cannot merge the value "{0}" with the value "{1}" for the field "{2}".'.format(
                    JSON.stringify(value1),
                    JSON.stringify(value2),
                    name
                )
            );
        }

        return value;
    }

    /**
     * @interface {danf:manipulation.dataInterpreter}
     */
    Type.prototype.interpret = function(name, value, contract, parameters) {
        // Check the existence of the mandatory type parameter for the field.
        if (!contract.type) {
            throw new Error(
                'There is no type parameter defined for the contract of the field "{0}".'.format(
                    name
                )
            );
        }

        if (null != value) {
            // Handle callback type.
            if ('function' === typeof contract.type) {
                var callbackReturn = contract.type(value);

                if (null != callbackReturn && true !== callbackReturn) {
                    throw new Error(
                        'The given value "{0}" of type "{1}" for the field "{2}" is not valid{3}.'.format(
                            JSON.stringify(value),
                            typeof value,
                            name,
                            'string' === typeof callbackReturn ? ' ({0})'.format(callbackReturn) : ''
                        )
                    );
                }
            } else {
                // Check the type of the field.
                switch (contract.type) {
                    case 'embedded':
                    case 'embedded_array':
                    case 'embedded_object':
                    case 'embedded_array_object':
                        if (!contract.embed) {
                            throw new Error(
                                'The contract for the embedded field "{0}" must have an "embed" parameter.'.format(
                                    name
                                )
                            );
                        }

                        switch (contract.type) {
                            case 'embedded':
                                if ('object' !== typeof value) {
                                    throw new Error(
                                        'The value of the field "{0}" must be an "object"; "{1}" given instead.'.format(
                                            name,
                                            typeof value
                                        )
                                    );
                                }

                                for (var key in value) {
                                    if (undefined === contract.embed[key]) {
                                        throw new Error(
                                            'The embedded field "{0}" is not defined in the contract of the field "{1}".'.format(
                                                key,
                                                name
                                            )
                                        );
                                    }
                                }

                                for (var key in contract.embed) {
                                    value[key] = this._dataResolver.resolve(
                                        value[key],
                                        contract.embed[key],
                                        formatFieldName(name, key),
                                        parameters,
                                        false
                                    );

                                    if (undefined === value[key]) {
                                        delete value[key];
                                    }
                                }

                                break;
                            case 'embedded_array':
                                if (!Array.isArray(value)) {
                                    throw new Error(
                                        'The value of the field "{0}" must be an "array"; "{1}" given instead.'.format(
                                            name,
                                            typeof value
                                        )
                                    );
                                }

                                for (var index = 0; index < value.length; index++) {
                                    var item = value[index];

                                    if ('object' !== typeof item) {
                                        throw new Error(
                                            'The value of the field "{0}" must be an "array of objects"; a "{1}" was found in the array.'.format(
                                                name,
                                                typeof item
                                            )
                                        );
                                    }

                                    for (var key in item) {
                                        if (undefined === contract.embed[key]) {
                                            throw new Error(
                                                'The embedded field "{0}" is not defined in the contract of the field "{1}".'.format(
                                                    key,
                                                    formatFieldName(name, index)
                                                )
                                            );
                                        }
                                    }

                                    for (var key in contract.embed) {
                                        item[key] = this._dataResolver.resolve(
                                            item[key],
                                            contract.embed[key],
                                            '{0}[{1}].{2}'.format(name, index, key),
                                            parameters,
                                            false
                                        );
                                    }
                                }

                                break;
                            case 'embedded_object':
                                if ('object' !== typeof value) {
                                    throw new Error(
                                        'The value of the field "{0}" must be an "object"; "{1}" given instead.'.format(
                                            name,
                                            typeof value
                                        )
                                    );
                                }

                                for (var mixedKey in value) {
                                    var item = value[mixedKey];

                                    if ('object' !== typeof item) {
                                        throw new Error(
                                            'The value of the field "{0}" must be an "object of object properties"; a "{1}" was found in a property.'.format(
                                                name,
                                                typeof item
                                            )
                                        );
                                    }

                                    for (var key in item) {
                                        if (undefined === contract.embed[key]) {
                                            throw new Error(
                                                'The embedded field "{0}" is not defined in the contract of the field "{1}".'.format(
                                                    key,
                                                    formatFieldName(name, mixedKey)
                                                )
                                            );
                                        }
                                    }

                                    for (var key in contract.embed) {
                                        item[key] = this._dataResolver.resolve(
                                            item[key],
                                            contract.embed[key],
                                            formatFieldName(name, mixedKey, key),
                                            parameters,
                                            false
                                        );
                                    }
                                }

                                break;
                            case 'embedded_array_object':
                                if ('object' !== typeof value) {
                                    throw new Error(
                                        'The value of the field "{0}" must be an "object"; "{1}" given instead.'.format(
                                            name,
                                            typeof value
                                        )
                                    );
                                }

                                for (var mixedKey in value) {
                                    var item = value[mixedKey];

                                    if (!Array.isArray(item)) {
                                        throw new Error(
                                            'The value of the field "{0}" must be an "object of array properties"; a "{1}" was found in a property.'.format(
                                                name,
                                                typeof item
                                            )
                                        );
                                    }

                                    for (var index = 0; index < item.length; index++) {
                                        var embeddedItem = item[index];

                                        if ('object' !== typeof embeddedItem) {
                                            throw new Error(
                                                'The value of the field "{0}" must be an "object of arrays of object properties"; a "{1}" was found in the array of an object.'.format(
                                                    name,
                                                    typeof embeddedItem
                                                )
                                            );
                                        }

                                        for (var key in embeddedItem) {
                                            if (undefined === contract.embed[key]) {
                                                throw new Error(
                                                    'The embedded field "{0}" is not defined in the contract of the field "{1}".'.format(
                                                        key,
                                                        formatFieldName(name, mixedKey, index)
                                                    )
                                                );
                                            }
                                        }

                                        for (var key in contract.embed) {
                                            embeddedItem[key] = this._dataResolver.resolve(
                                                embeddedItem[key],
                                                contract.embed[key],
                                                formatFieldName(name, mixedKey, index, key),
                                                parameters,
                                                false
                                            );
                                        }
                                    }
                                }

                                break;
                        }

                        break;
                    default:
                        var type = contract.type;

                        try {
                            var results = Object.checkType(value, contract.type, true, name);

                            type = results.matchedType;
                            value = results.interpretedValue;
                        } catch (error) {
                            if (-1 === error.expected.indexOf('interface')) {
                                throw error;
                            }
                        }

                        switch (type) {
                            case 'string':
                            case 'number':
                            case 'boolean':
                            case 'function':
                            case 'date':
                            case 'error':
                            case 'mixed':
                            case 'array':
                            case 'object':
                            case 'undefined':
                            case 'null':
                            case 'string_array':
                            case 'number_array':
                            case 'boolean_array':
                            case 'function_array':
                            case 'date_array':
                            case 'error_array':
                            case 'mixed_array':
                            case 'string_array_array':
                            case 'number_array_array':
                            case 'boolean_array_array':
                            case 'function_array_array':
                            case 'date_array_array':
                            case 'error_array_array':
                            case 'mixed_array_array':
                            case 'string_object_array':
                            case 'number_object_array':
                            case 'boolean_object_array':
                            case 'function_object_array':
                            case 'date_object_array':
                            case 'error_object_array':
                            case 'mixed_object_array':
                            case 'number_object':
                            case 'string_object':
                            case 'boolean_object':
                            case 'function_object':
                            case 'date_object':
                            case 'error_object':
                            case 'mixed_object':
                            case 'number_array_object':
                            case 'string_array_object':
                            case 'boolean_array_object':
                            case 'function_array_object':
                            case 'date_array_object':
                            case 'error_array_object':
                            case 'mixed_array_object':
                            case 'number_object_object':
                            case 'string_object_object':
                            case 'boolean_object_object':
                            case 'function_object_object':
                            case 'date_object_object':
                            case 'error_object_object':
                            case 'mixed_object_object':
                                break;
                            default:
                                throw new Error(
                                    'The type "{0}" defined for the field "{1}" does not exist.'.format(
                                        contract.type,
                                        name
                                    )
                                );
                        }
                }
            }
        }

        return value;
    }

    /**
     * Format the name of a field.
     *
     * @param {string} name The name of the field.
     * @param {string} params The other names in each next argument.
     * @api private
     */
    var formatFieldName = function(name) {
        var formattedName = name || '',
            keys = Array.prototype.slice.call(arguments)
        ;

        keys.shift();

        for (var i = 0; i < keys.length; i++) {
            if ('' === formattedName) {
                formattedName = keys.shift();
            } else {
                formattedName = '{0}.{1}'.format(formattedName, keys[i]);
            }
        }

        return formattedName;
    }

    /**
     * Expose `Type`.
     */
    return Type;
});