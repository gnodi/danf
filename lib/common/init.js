'use strict';

/**
 * Global helpers and compatibilizers.
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    };
}

if (!Array.isArray) {
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        if (n >= len) {
            return -1;
        }

        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }

        return -1;
    };
}

if (!Object.isInstanceOf) {
    Object.isInstanceOf = function(object, interfaceName) {
        var implementedInterfaces = [],
            implementsInterface = false
        ;

        if (object && 'object' === typeof object) {
            var class_ = Object.getPrototypeOf(object);

            if (class_.__metadata && class_.__metadata.implements) {
                implementedInterfaces = class_.__metadata.implements;
            } else if (class_.constructor) {
                implementedInterfaces = class_.constructor.__metadata.implements;
            }
        }

        if (implementedInterfaces) {
            for (var i = 0; i < implementedInterfaces.length; i++) {
                if (interfaceName === implementedInterfaces[i]) {
                    implementsInterface = true;
                    break;
                }
            }
        }

        return implementsInterface;
    };
}

if (!Object.hasMethod) {
    Object.hasMethod = function(object, methodName, throwsError) {
        if (undefined !== object[methodName]) {
            if ('function' === typeof object[methodName]) {
                return true;
            } else if (throwsError) {
                throw new Error(
                    'The object should implement a method "{0}" but a "{1}" was found instead of the function.'.format(
                        methodName,
                        typeof object[methodName]
                    )
                );
            }
        } else if (throwsError) {
            throw new Error(
                'The object should implement a method "{0}".'.format(methodName)
            );
        }

        return false;
    };
}

if (!Object.hasGetter) {
    Object.hasGetter = function(object, propertyName, throwsError) {
        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

            if (descriptor && (descriptor.get || descriptor.value)) {
                return true;
            }
        } while (object = Object.getPrototypeOf(object));

        if (throwsError) {
            throw new Error(
                'The object should implement a getter for the property "{0}".'.format(propertyName)
            );
        }

        return false;
    };
}

if (!Object.hasSetter) {
    Object.hasSetter = function(object, propertyName, throwsError) {
        var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

            if (descriptor && descriptor.set) {
                return true;
            }
        } while (object = Object.getPrototypeOf(object));

        if (throwsError) {
            throw new Error(
                'The object should implement a setter for the property "{0}".'.format(propertyName)
            );
        }

        return false;
    };
}

if (!Object.hasGetterSetter) {
    Object.hasGetterSetter = function(object, propertyName, throwsError) {
        var descriptor = Object.getOwnPropertyDescriptor(object, propertyName),
            hasGetter = false,
            hasSetter = false
        ;

        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

            if (descriptor && (descriptor.get || descriptor.value)) {
                hasGetter = true;
            }
            if (descriptor && descriptor.set) {
                hasSetter = true;
            }
        } while (object = Object.getPrototypeOf(object));

        if (hasSetter && hasGetter) {
            return true;
        }

        if (throwsError) {
            if (hasGetter) {
                throw new Error(
                    'The object should implement a setter for the property "{0}".'.format(propertyName)
                );
            } else if (hasSetter) {
                throw new Error(
                    'The object should implement a getter for the property "{0}".'.format(propertyName)
                );
            } else {
                throw new Error(
                    'The object should implement a getter and a setter for the property "{0}".'.format(propertyName)
                );
            }
        }

        return false;
    };
}

if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length
        ;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }

            return result;
        };
    }());
}

if (!Object.getPropertyDescriptor) {
    Object.getPropertyDescriptor = function(object, propertyName, throwsError) {
        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

            if (descriptor) {
                return descriptor;
            }
        } while (object = Object.getPrototypeOf(object));

        if (throwsError) {
            throw new Error(
                'The object has no descriptor for the property "{0}".'.format(propertyName)
            );
        }

        return null;
    };
}

if (!Object.hasPropertyDescriptor) {
    Object.hasPropertyDescriptor = function(object, propertyName) {
        return null !== Object.getPropertyDescriptor(object, propertyName, false);
    };
}

if (!Object.getPropertyNames) {
    Object.getPropertyNames = function(object) {
        var propertyNames = {};

        do {
            var ownPropertyNames = Object.getOwnPropertyNames(object);

            for (var i = 0; i < ownPropertyNames.length; i++) {
                propertyNames[ownPropertyNames[i]] = true;
            }
        } while (object = Object.getPrototypeOf(object));

        return Object.keys(propertyNames);
    };
}

if (!Object.checkType) {
    /**
     * Check the type of a value.
     *
     * @param {mixed} value The value.
     * @param {string} type The type.
     * @param {boolean} interpret Whether or not to interpret the value. False by default.
     * @param {string|undefined} name The optional name of the value to check.
     * @throws {error} if the value is not of the given type.
     * @api public
     */
    Object.checkType = function(value, type, interpret, name) {
        var types = type.split('|'),
            interpretedValue = value,
            getTypeName = function(value, type) {
                if (null !== value && 'object' === typeof value) {
                    var class_ = Object.getPrototypeOf(value),
                        implementedInterfaces
                    ;

                    if (class_.__metadata) {
                        implementedInterfaces = class_.__metadata.implements;
                    } else if (class_.constructor) {
                        implementedInterfaces = class_.constructor.__metadata.implements;
                    }

                    if (implementedInterfaces) {
                        return 'instance of [`{0}`]'.format(implementedInterfaces.join('`, `'));
                    }
                }

                return type;
            },
            getArticle = function(word) {
                return word[0] in {a: 1, e: 1, i: 1, o: 1, u: 1}
                    ? 'an'
                    : 'a'
                ;
            },
            interpretValue = function(value, prefix, suffixes) {
                if (suffixes.length >= 1) {
                    var suffixes = suffixes.slice(0),
                        suffix = suffixes.pop()
                    ;

                    switch (suffix) {
                        case 'array':
                            if (Array.isArray(value)) {
                                var interpretedValue = [];

                                for (var i = 0; i < value.length; i++) {
                                    interpretedValue[i] = interpretValue(value[i], prefix, suffixes);
                                }

                                return interpretedValue;
                            }

                            return value;
                        case 'object':
                            if ('object' === typeof value) {
                                var interpretedValue = {};

                                for (var key in value) {
                                    interpretedValue[key] = interpretValue(value[key], prefix, suffixes);
                                }

                                return interpretedValue;
                            }

                            return value;
                        default:
                            throw new Error(
                                'The suffix "{0}" is not valid'.format(suffix)
                            );
                    }
                }

                switch (prefix) {
                    case 'number':
                        if ('string' === typeof value) {
                            var parsedValue = parseInt(value, 10);

                            if (parsedValue == value) {
                                return parsedValue;
                            }
                        }

                        break;
                    case 'boolean':
                        switch (typeof value) {
                            case 'string':
                                var parsedValue = parseInt(value, 10);

                                if (!isNaN(parsedValue)) {
                                    return parsedValue ? true : false;
                                }

                                break;
                            case 'number':
                                return value ? true : false;
                        }

                        break;
                }

                return value;
            },
            buildResults = function() {
                return {
                    interpretedValue: interpretedValue,
                    matchedType: type
                };
            },
            getTypePrefix = function(type) {
                var parts = type.split('_');

                return parts.shift();
            },
            getTypeSuffix = function(type, level) {
                var suffixes = type.split('_'),
                    suffix = []
                ;

                for (var i = 0; i < level; i++) {
                    var suffixPart = suffixes.pop();

                    if (null == suffixPart) {
                        break;
                    }

                    suffix.push(suffixPart);
                }

                return suffix.join('_');
            },
            valueType = Object.getType(interpretedValue),
            exactMatchedType,
            matchedType,
            typeName = getTypeName(interpretedValue, valueType),
            instead = '',
            expected = ''
        ;

        switch (typeName) {
            case 'undefined':
            case 'null':
                instead = '"{0}"'.format(typeName);

                break;
            default:
                instead = '{0} "{1}"'.format(
                    getArticle(typeName),
                    typeName
                );
        }

        for (var i = 0; i < types.length; i++) {
            type = types[i];

            if (type === valueType || (type === 'null' && valueType === 'undefined')) {
                exactMatchedType = type;
            }

            if (interpret) {
                // Try to interpret the value.
                var typeSuffixes = type.split('_'),
                    typePrefix = typeSuffixes.shift()
                ;

                var interpretedTypeValue = interpretValue(
                        interpretedValue,
                        typePrefix,
                        typeSuffixes
                    ),
                    interpretedType = Object.getType(interpretedTypeValue)
                ;

                if (type === interpretedType) {
                    exactMatchedType = type;
                    interpretedValue = interpretedTypeValue;
                }
            }

            // Check type.
            var isInterfaceType = Object.isInterfaceType(type);

            if (null == exactMatchedType) {
                expected = expected ? expected + ' or ' : '';

                if (!isInterfaceType) {
                    switch (type) {
                        case 'undefined':
                        case 'null':
                            expected += '"{0}"'.format(type);

                            break;
                        default:
                            expected += '{0} "{1}"'.format(
                                getArticle(type),
                                type
                            );
                    }

                    if (
                        ('array' === valueType &&
                         'array' === getTypeSuffix(type, 1)) ||
                        ('object' === valueType &&
                         'object' === getTypeSuffix(type, 1))
                    ) {
                        matchedType = type;
                    }

                    switch (type) {
                        case 'mixed':
                            matchedType = type;

                            break;
                        case 'array':
                        case 'mixed_array':
                            if ('array' === getTypeSuffix(valueType, 1)) {
                                matchedType = type;
                            }

                            break;
                        case 'object':
                        case 'mixed_object':
                            if ('object' === getTypeSuffix(valueType, 1)) {
                                matchedType = type;
                            }

                            break;
                        case 'mixed_array_array':
                            if ('array_array' === getTypeSuffix(valueType, 2)) {
                                matchedType = type;
                            }

                            break;
                        case 'mixed_array_object':
                            if ('array_object' === getTypeSuffix(valueType, 2)) {
                                matchedType = type;
                            }

                            break;
                        case 'mixed_object_array':
                            if ('object_array' === getTypeSuffix(valueType, 2)) {
                                matchedType = type;
                            }

                            break;
                        case 'mixed_object_object':
                            if ('object_object' === getTypeSuffix(valueType, 2)) {
                                matchedType = type;
                            }

                            break;
                    }
                } else {
                    var arraySuffix = '_array',
                        objectSuffix = '_object',
                        interface_ = type,
                        checkResult = false
                    ;

                    if (arraySuffix === type.substr(-1 * arraySuffix.length)) {
                        var itemType = type.substr(0, type.length - arraySuffix.length)
                        expected += 'an "array of instance of `{0}` values"'.format(itemType);

                        if (Array.isArray(value)) {
                            checkResult = true;

                            for (var i = 0; i < value.length; i++) {
                                checkResult = Object.isInstanceOf(value[i], itemType);

                                if (!checkResult) {
                                    break;
                                }
                            }
                        }
                    } else if (objectSuffix === type.substr(-1 * objectSuffix.length)) {
                        var itemType = type.substr(0, type.length - objectSuffix.length)
                        expected += 'an "object of instance of `{0}` properties"'.format(itemType);

                        if ('object' === typeof value && !Array.isArray(value) && null !== value) {
                            checkResult = true;

                            for (var key in value) {
                                checkResult = Object.isInstanceOf(value[key], itemType);

                                if (!checkResult) {
                                    break;
                                }
                            }
                        }
                    } else {
                        expected += 'an "instance of `{0}`"'.format(type);
                        checkResult = Object.isInstanceOf(value, type);
                    }

                    if (checkResult) {
                        exactMatchedType = type;
                    }
                }
            }
        }

        if (null != exactMatchedType) {
            matchedType = exactMatchedType;
        }

        if (null != matchedType) {
            return {
                interpretedValue: interpretedValue,
                matchedType: matchedType
            };
        }

        var error = new Error('The expected value{0} is {1}; {2} given instead.'.format(
                name ? ' for "{0}"'.format(name) : '',
                expected,
                instead
            ))
        ;

        error.expected = expected;
        error.instead = instead;

        throw error;
    };
}

if (!Object.getType) {
    /**
     * Get the type of a value.
     *
     * @param {mixed} value The value.
     * @param {number|undefined} level The level of recursion.
     * @api public
     */
    Object.getType = function(value, level) {
        var getTypes = function(value) {
                var types = {},
                    hasArray = false,
                    hasObject = false
                ;

                for (var key in value) {
                    try {
                        var type = Object.getType(value[key], level + 1);

                        types[type] = true;

                        switch (type) {
                            case 'array':
                                hasArray = true;

                                break;
                            case 'object':
                                hasObject = true;

                                break;
                        }
                    } catch (error) {
                        // Handle deprecated properties throwing errors.
                    }
                }

                for (var type in types) {
                    var parts = type.split('_'),
                        suffix = parts.pop()
                    ;

                    if (parts.length >= 1) {
                        switch (suffix) {
                            case 'array':
                                if (hasArray) {
                                    delete types[suffix];
                                }

                                break;
                            case 'object':
                                if (hasObject) {
                                    delete types[suffix];
                                }

                                break;
                            default:
                                throw new Error(
                                    'The suffix "{0}" is not valid'.format(suffix)
                                );
                        }
                    }
                }

                return Object.keys(types);
            }
        ;

        level = undefined === level ? 0 : level;

        if (null === value) {
            return 'null';
        }

        if ('object' !== typeof value) {
            return typeof value;
        }

        if (value instanceof Date) {
            return 'date';
        }

        if (value instanceof Error) {
            return 'error';
        }

        if ('object' === typeof value) {
            if (level === 2) {
                return 'mixed';
            }

            if (Array.isArray(value)) {
                if (0 === value.length) {
                    return 'array';
                }

                var types = getTypes(value);

                if (types.length > 1) {
                    var suffixes = {};

                    for (var i = 0; i < types.length; i++) {
                        var suffix = types[i].split('_');

                        suffix.shift();
                        suffixes[suffix.join('_')] = true;
                    }

                    suffixes = Object.keys(suffixes);

                    if (suffixes.length > 1 || '' === suffixes[0]) {
                        return 'mixed_array';
                    }

                    return 'mixed_{0}_array'.format(suffixes[0]);
                }

                return '{0}_array'.format(types[0]);
            } else {
                var class_ = Object.getPrototypeOf(value);

                // Handle case of an object of a real class.
                if (
                    class_ &&
                    (
                        class_.__metadata && class_.__metadata.id ||
                        (class_.constructor && class_.constructor.__metadata && class_.constructor.__metadata.id)
                    )
                ) {
                    return 'object';
                }

                if (0 === Object.keys(value).length) {
                    return 'object';
                }

                var types = getTypes(value);

                if (types.length > 1) {
                    var suffixes = {};

                    for (var i = 0; i < types.length; i++) {
                        var suffix = types[i].split('_');

                        suffix.shift();
                        suffixes[suffix.join('_')] = true;
                    }

                    suffixes = Object.keys(suffixes);

                    if (suffixes.length > 1 || '' === suffixes[0]) {
                        return 'mixed_object';
                    }

                    return 'mixed_{0}_object'.format(suffixes[0]);
                }

                return '{0}_object'.format(types[0]);
            }
        }
    }
}

if (!Object.isInterfaceType) {
    /**
     * Whether or not a type is an interface.
     *
     * @param {string} type The type.
     * @return {boolean} True if the type is an interface, false otherwise.
     * @api public
     */
    Object.isInterfaceType = function(type) {
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
                return false;
        }

        return true;
    }
}

if (!Function.prototype.__metadata) {
    Object.defineProperty(Function.prototype, '__metadata', {
        get: function() {
            if (!this.__metadata__) {
                this.__metadata__ = {};
            }

            return this.__metadata__;
        },
        set: function(metadata) { this.__metadata__ = metadata; },
        enumerable: false
    });
}

if (!Function.prototype.defineImplementedInterfaces) {
    /**
     * Define the implemented interfaces of a class.
     *
     * @param {string_array} interfaces The names of the interfaces.
     * @api public
     */
    Function.prototype.defineImplementedInterfaces = function(interfaces) {
        Object.checkType(interfaces, 'string_array');

        this.__metadata.implements = interfaces;
    };
}

if (!Function.prototype.defineExtendedClass) {
    /**
     * Define the extended class of a class.
     *
     * @param {string} class_ The name of the class.
     * @api public
     */
    Function.prototype.defineExtendedClass = function(class_) {
        Object.checkType(class_, 'string');

        this.__metadata.extends = class_;
    };
}

if (!Function.prototype.defineAsAbstract) {
    /**
     * Define a class as an abstract class.
     *
     * @api public
     */
    Function.prototype.defineAsAbstract = function() {
        this.__metadata.abstract = true;
    };
}

if (!Function.prototype.defineDependency) {
    /**
     * Define a dependency of an object.
     *
     * @param {string} property The property name.
     * @param {string} type The property type.
     * @param {string} providedType The provided type (optionnal).
     * @api public
     */
    Function.prototype.defineDependency = function(property, type, providedType) {
        if (!this.__metadata.dependencies) {
            this.__metadata.dependencies = {};
        }

        Object.checkType(property, 'string');
        Object.checkType(type, 'string');
        Object.checkType(providedType, 'string|undefined');

        this.__metadata.dependencies[property] = {type: type, providedType: providedType};
    };
}

if (!Object.checkDependencies) {
    /**
     * Check the dependencies of an object.
     *
     * @param {object} object The object.
     * @api public
     */
    Object.checkDependencies = function(object) {
        var id = object.__metadata && object.__metadata.id ? ' "{0}"'.format(object.__metadata.id) : '';

        for (var property in object.__metadata.dependencies) {
            var dependencyType = object.__metadata.dependencies[property],
                dependency = object[property]
            ;

            try {
                Object.checkType(dependency, dependencyType.type);

                var providedType = dependencyType.providedType;

                if (providedType) {
                    if (dependency instanceof Object) {
                        if (dependency.providedType) {
                            var splitProvidedType = dependency.providedType.split('|'),
                                splitType = providedType.split('|'),
                                typeOk = false
                            ;

                            for (var i = 0; i < splitType.length; i++) {
                                for (var j = 0; j < splitProvidedType.length; j++) {
                                    if (splitType[i] === splitProvidedType[j]) {
                                        typeOk = true;
                                        break;
                                    }
                                }

                                if (typeOk) {
                                    break;
                                }
                            }

                            if (!typeOk) {
                                throw new Error(
                                    'The object{0} expected a provider of "{1}" for its property "{2}"; a provider of "{3}" given instead.'.format(
                                        id,
                                        providedType,
                                        property,
                                        dependency.providedType
                                    )
                                );
                            }
                        } else {
                            throw new Error(
                                'The object{0} expected a provider of "{1}" for its property "{2}"; an object with no "providedType" getter given instead.'.format(
                                    id,
                                    providedType,
                                    property
                                )
                            );
                        }
                    } else {
                        throw new Error(
                            'The object{0} expected a provider of "{1}" for its property "{2}"; a "{3}" given instead.'.format(
                                id,
                                providedType,
                                property,
                                typeof dependency
                            )
                        );
                    }
                }
            } catch (error) {
                if (error.instead) {
                    throw new Error(
                        'The object{0} expected {1} for its property "{2}"; {3} given instead.'.format(
                            id,
                            error.expected,
                            property,
                            error.instead
                        )
                    );
                }

                throw error;
            }
        }
    };
}