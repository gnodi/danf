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
            type,
            getTypeName = function(value) {
                var name = '';

                if (Array.isArray(value)) {
                    name = 'array';
                } else if (value instanceof Date) {
                    name = 'date';
                } else if (value instanceof Error) {
                    name = 'error';
                } else if (undefined === value) {
                    name = 'undefined';
                } else if (null == value) {
                    name = 'null';
                }  else if ('object' === typeof value) {
                    var class_ = Object.getPrototypeOf(value),
                        implementedInterfaces
                    ;

                    if (class_.__metadata) {
                        implementedInterfaces = class_.__metadata.implements;
                    } else if (class_.constructor) {
                        implementedInterfaces = class_.constructor.__metadata.implements;
                    }

                    if (implementedInterfaces) {
                        name = 'instance of [`{0}`]'.format(implementedInterfaces.join('`, `'));
                    } else {
                        name = 'object';
                    }
                } else {
                    name = '{0}'.format(typeof value);
                }

                return name;
            },
            getTypePrefix = function(value) {
                var prefix = (typeof value)[0] in {a: 1, e: 1, i: 1, o: 1, u: 1} ? 'an' : 'a';

                if (Array.isArray(value)) {
                    prefix = 'an';
                } else if (null === value || undefined === value) {
                    prefix = '';
                } else if ('object' === typeof value) {
                    var class_ = Object.getPrototypeOf(value),
                        implementedInterfaces = []
                    ;

                    if (class_.__metadata) {
                        implementedInterfaces = class_.__metadata.implements || [];
                    } else if (class_.constructor) {
                        implementedInterfaces = class_.constructor.__metadata.implements || [];
                    }

                    if (implementedInterfaces) {
                        prefix = 'an';
                    }
                }

                return prefix;
            },
            interpretValue = function(value, type) {
                switch (type) {
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
            instead = '{0} "{1}"'.format(getTypePrefix(value), getTypeName(value)),
            expected = ''
        ;

        for (var i = 0; i < types.length; i++) {
            type = types[i];

            expected = expected ? expected + ' or ' : '';

            switch (type) {
                case 'boolean':
                case 'number':
                case 'string':
                case 'function':
                    if (interpret) {
                        interpretedValue = interpretValue(value, type);
                    }

                    if (type !== typeof interpretedValue) {
                        expected += 'a "{0}"'.format(type);
                    } else {
                        return buildResults();
                    }

                    break;
                case 'date':
                    if (!(value instanceof Date)) {
                        expected += 'a "date"';
                    } else {
                        return buildResults();
                    }

                    break;
                case 'error':
                    if (!(value instanceof Error)) {
                        expected += 'an "error"';
                    } else {
                        return buildResults();
                    }

                    break;
                case 'array':
                    if (!Array.isArray(value)) {
                        expected += 'an "array"';
                    } else {
                        return buildResults();
                    }

                    break;
                case 'object':
                    if (type !== typeof value || Array.isArray(value) || null === value) {
                        expected += 'an "{0}"'.format(type);
                    } else {
                        return buildResults();
                    }

                    break;
                case 'undefined':
                    if (type !== typeof value) {
                        expected += '"{0}"'.format(type);
                    } else {
                        return buildResults();
                    }

                    break;
                case 'null':
                    if (null != value) {
                        expected += '"{0}"'.format(type);
                    } else {
                        return buildResults();
                    }

                    break;
                case 'free':
                case 'mixed':
                    return buildResults();
                case 'string_array':
                case 'number_array':
                case 'boolean_array':
                case 'function_array':
                case 'date_array':
                case 'error_array':
                case 'free_array':
                    var itemType = type.replace('_array', '');

                    expected += 'an "array of {0} values"'.format(itemType);

                    if (Array.isArray(value)) {
                        var typeOk = true;

                        if ('free' !== itemType) {
                            interpretedValue = [];

                            for (var index = 0; index < value.length; index++) {
                                if (interpret) {
                                    interpretedValue[index] = interpretValue(value[index], itemType);
                                } else {
                                    interpretedValue[index] = value[index];
                                }

                                switch (itemType) {
                                    case 'date':
                                        if (interpretedValue[index] instanceof Date) {
                                            break;
                                        }
                                    case 'error':
                                        if (interpretedValue[index] instanceof Error) {
                                            break;
                                        }
                                    default:
                                        if (itemType === typeof interpretedValue[index]) {
                                            break;
                                        }

                                        typeOk = false;
                                        instead = 'an "array with at least one {0}"'.format(getTypeName(value[index]));
                                }
                            }
                        }

                        if (typeOk) {
                            return buildResults();
                        }
                    }

                    break;
                case 'number_array_array':
                case 'string_array_array':
                case 'boolean_array_array':
                case 'free_array_array':
                    var itemType = type.replace('_array_array', '');

                    expected += 'an "array of arrays of {0} values"'.format(itemType);

                    if (Array.isArray(value)) {
                        var typeOk = true;

                        interpretedValue = [];

                        for (var i = 0; i < value.length; i++) {
                            var arrayValue = value[i];

                            if (!Array.isArray(arrayValue)) {
                                instead = 'an "array with at least one {0} value"'.format(getTypeName(arrayValue));
                                typeOk = false;

                                break;
                            }

                            if ('free' !== itemType) {
                                interpretedValue[i] = [];

                                for (var j = 0; j < arrayValue.length; j++) {
                                    if (interpret) {
                                        interpretedValue[i][j] = interpretValue(arrayValue[j], itemType);
                                    } else {
                                        interpretedValue[i][j] = arrayValue[j];
                                    }

                                    if (itemType !== typeof interpretedValue[i][j]) {
                                        instead = 'an "array with at least one array with at least one {0} value"'.format(getTypeName(arrayValue[j])),
                                        typeOk = false;

                                        break;
                                    }
                                }
                            } else {
                                interpretedValue[i] = value[i];
                            }

                            if (!typeOk) {
                                break;
                            }
                        }

                        if (typeOk) {
                            return buildResults();
                        }
                    }

                    break;
                case 'number_object':
                case 'string_object':
                case 'boolean_object':
                case 'function_object':
                case 'date_object':
                case 'error_object':
                case 'free_object':
                    var itemType = type.replace('_object', '');

                    expected += 'an "object of {0} properties"'.format(itemType);

                    if ('object' === typeof value && !Array.isArray(value) && null !== value) {
                        var typeOk = true;

                        if ('free' !== itemType) {
                            interpretedValue = {};

                            for (var key in value) {
                                if (interpret) {
                                    interpretedValue[key] = interpretValue(value[key], itemType);
                                } else {
                                    interpretedValue[key] = value[key];
                                }

                                switch (itemType) {
                                    case 'date':
                                        if (interpretedValue[key] instanceof Date) {
                                            break;
                                        }
                                    case 'error':
                                        if (interpretedValue[key] instanceof Error) {
                                            break;
                                        }
                                    default:
                                        if (itemType === typeof interpretedValue[key]) {
                                            break;
                                        }

                                        typeOk = false;
                                        instead = 'an "object with at least one {0} property"'.format(getTypeName(value[key]));
                                }
                            }
                        }

                        if (typeOk) {
                            return buildResults();
                        } else {
                            break;
                        }
                    }

                    break;
                case 'number_array_object':
                case 'string_array_object':
                case 'boolean_array_object':
                case 'free_array_object':
                    var itemType = type.replace('_array_object', '');

                    expected += 'an "object of arrays of {0} properties"'.format(itemType);

                    if ('object' === typeof value && !Array.isArray(value) && null !== value) {
                        var typeOk = true;

                        interpretedValue = {};

                        for (var key in value) {
                            var propertyValue = value[key];

                            if (!Array.isArray(propertyValue)) {
                                instead = 'an "object with at least one {0} property"'.format(getTypeName(propertyValue));
                                typeOk = false;

                                break;
                            }

                            if ('free' !== itemType) {
                                interpretedValue[key] = [];

                                for (var j = 0; j < propertyValue.length; j++) {
                                    if (interpret) {
                                        interpretedValue[key][j] = interpretValue(propertyValue[j], itemType);
                                    } else {
                                        interpretedValue[key][j] = propertyValue[j];
                                    }

                                    if (itemType !== typeof interpretedValue[key][j]) {
                                        instead = 'an "object with at least one array with at least one {0} property"'.format(getTypeName(propertyValue[j]));
                                        typeOk = false;

                                        break;
                                    }
                                }
                            } else {
                                interpretedValue[key] = value[key];
                            }

                            if (!typeOk) {
                                break;
                            }
                        }

                        if (typeOk) {
                            return buildResults();
                        }
                    }

                    break;
                // Interface case.
                default:
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
                                    instead = 'an "array with at least one {0} value"'.format(getTypeName(value[i]));

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
                                    instead = 'an "object with at least one {0} property"'.format(getTypeName(value[key]));

                                    break;
                                }
                            }
                        }
                    } else {
                        expected += 'an "instance of `{0}`"'.format(type);
                        checkResult = Object.isInstanceOf(value, type);
                    }

                    if (checkResult) {
                        return buildResults();
                    }

                    break;
            }
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
            case 'boolean':
            case 'number':
            case 'string':
            case 'function':
            case 'date':
            case 'error':
            case 'array':
            case 'object':
            case 'undefined':
            case 'null':
            case 'free':
            case 'mixed':
            case 'string_array':
            case 'number_array':
            case 'boolean_array':
            case 'function_array':
            case 'date_array':
            case 'error_array':
            case 'free_array':
            case 'number_array_array':
            case 'string_array_array':
            case 'boolean_array_array':
            case 'free_array_array':
            case 'number_object':
            case 'string_object':
            case 'boolean_object':
            case 'function_object':
            case 'date_object':
            case 'error_object':
            case 'free_object':
            case 'number_array_object':
            case 'string_array_object':
            case 'boolean_array_object':
            case 'free_array_object':
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