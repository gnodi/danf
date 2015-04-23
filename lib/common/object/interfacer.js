'use strict';

/**
 * Expose `Interfacer`.
 */
module.exports = Interfacer;

/**
 * Initialize a new interfacer.
 *
 * @param {danf:object.interfacesRegistry} interfacesRegistry The interfaces registry.
 * @param {boolean} debug Whether or not the debug mode is active.
 */
function Interfacer(interfacesRegistry, debug) {
    if (interfacesRegistry) {
        this.interfacesRegistry = interfacesRegistry;
    }
    this.debug = null == debug ? true : debug;
}

Interfacer.defineImplementedInterfaces(['danf:object.interfacer']);

Interfacer.defineDependency('_interfacesRegistry', 'danf:object.interfacesRegistry');
Interfacer.defineDependency('_debug', 'boolean');

/**
 * Whether or not the application is in debug mode.
 *
 * @param {boolean}
 * @api public
 */
Object.defineProperty(Interfacer.prototype, 'debug', {
    set: function(debug) { this._debug = debug ? true : false; }
});
/**
 * Set the interfaces registry.
 *
 * @param {danf:object.interfacesRegistry} interfacesRegistry The interfaces registry.
 * @api public
 */
Object.defineProperty(Interfacer.prototype, 'interfacesRegistry', {
    set: function(interfacesRegistry) { this._interfacesRegistry = interfacesRegistry; }
});

/**
 * @interface {danf:object.interfacer}
 */
Interfacer.prototype.addProxy = function (object, interfaceName) {
    // Prevent proxies to be added if not in debug mode because it takes performance.
    if (!this._debug) {
        return object;
    }

    return wrap.call(this, object, interfaceName);
}

/**
 * Wrap a class with a proxy to ensure the respect of the interface.
 *
 * @param {function} class_ The class function.
 * @param {string} interfaceName The name of the interface.
 * @api private
 */
var wrap = function(object, interfaceName) {
    // Check to not wrap several times.
    if (true === object.isProxy) {
        return object;
    }

    var proxy = Object.create(object),
        properties = Object.getPropertyNames(proxy)
    ;

    for (var i = 0; i < properties.length; i++) {
        var propertyName = properties[i];

        if ('__' !== propertyName.slice(0, 2)) {
            wrapMethod.call(this, object, interfaceName, proxy, propertyName);

            if ('function' !== typeof object[propertyName]
                && (!this._interfacesRegistry.hasMethod(interfaceName, propertyName)
                    || this._interfacesRegistry.hasGetter(interfaceName, propertyName)
                    || this._interfacesRegistry.hasGetter(interfaceName, propertyName)
                )
            ) {
                wrapProperty.call(this, object, interfaceName, proxy, propertyName);
            }
        }
    }

    proxy.isProxy = true;

    return proxy;
}

/**
 * Wrap a method with a proxy to ensure the respect of the interface.
 *
 * @param {function} object The object.
 * @param {string} interfaceName The name of the interface.
 * @param {object} proxy The proxy.
 * @param {string} methodName The name of the method.
 * @api private
 */
var wrapMethod = function(object, interfaceName, proxy, methodName) {
    var hasMethod = this._interfacesRegistry.hasMethod(interfaceName, methodName),
        prototype = Object.getPrototypeOf(proxy),
        propertyDescriptor = Object.getPropertyDescriptor(prototype, methodName, false)
    ;

    if (undefined !== propertyDescriptor.get || undefined !== propertyDescriptor.set || 'function' !== typeof propertyDescriptor.value) {
        // The method is not a function.
        if (hasMethod) {
            throw new Error(
                'The method "{0}" defined by the interface "{1}" must be implemented{2} as a function.'.format(
                    methodName,
                    interfaceName,
                    object.__metadata && object.__metadata.id ? ' by the class of the object "{0}"'.format(object.__metadata.id) : ''
                )
            );
        }

        // This is not a method.
        return;
    }

    // The method is not one of that defined by the interface.
    if (!hasMethod) {
        proxy[methodName] = function() {
            throw new Error(
                'The method "{0}"{1} is not accessible in the scope of the interface "{2}".'.format(
                    methodName,
                    this.__metadata && this.__metadata.id ? ' of the object "{0}"'.format(this.__metadata.id) : '',
                    interfaceName
                )
            );
        };
    // The method is one of that defined by the interface.
    } else {
        var methodDefinition = this._interfacesRegistry.getMethod(interfaceName, methodName);

        proxy[methodName] = function() {
            checkMethodArguments.call(this, methodName, interfaceName, methodDefinition['arguments'] || [], arguments);

            var returns = prototype[methodName].apply(prototype, arguments);

            if (methodDefinition['returns']) {
                try {
                    Object.checkType(returns, methodDefinition['returns']);
                } catch (error) {
                    if (error.instead) {
                        throw new Error(
                            'The method "{0}"{1} defined by the interface "{2}" returns {3}; {4} given instead.'.format(
                                methodName,
                                this.__metadata && this.__metadata.id ? ' of "{0}"'.format(this.__metadata.id) : '',
                                interfaceName,
                                error.expected,
                                error.instead
                            )
                        );
                    }

                    throw error;
                }
            }

            return returns;
        };
    }
}

/**
 * Wrap a getter with a proxy to ensure the respect of the interface.
 *
 * @param {function} object The class function.
 * @param {string} interfaceName The name of the interface.
 * @param {object} proxy The proxy.
 * @param {string} propertyName The name of the property.
 * @api private
 */
var wrapProperty = function(object, interfaceName, proxy, propertyName) {
    var self = this,
        prototype = Object.getPrototypeOf(proxy),
        hasGetter = this._interfacesRegistry.hasGetter(interfaceName, propertyName),
        hasSetter = this._interfacesRegistry.hasSetter(interfaceName, propertyName),
        propertyDescriptor = Object.getPropertyDescriptor(prototype, propertyName, false)
    ;

    if (null === propertyDescriptor || (undefined === propertyDescriptor.get && undefined === propertyDescriptor.value && undefined === propertyDescriptor.set)) {
        // The property has no descriptor.
        if (hasGetter || hasSetter) {
            throw new Error(
                'The property "{0}" defined by the interface "{1}" must be implemented{2} with a property descriptor.'.format(
                    propertyName,
                    interfaceName,
                    object.__metadata && object.__metadata.id ? ' by the class of the object "{0}"'.format(object.__metadata.id) : ''
                )
            );
        }

        // This is a method.
        if ('function' === typeof prototype[propertyName]) {
            return;
        }
    }

    var propertyDescriptor = {configurable: true};

    if (!hasGetter) {
        propertyDescriptor.get = function() {
            throw new Error(
                'The getter of the property "{0}"{1} is not accessible in the scope of the interface "{2}".'.format(
                    propertyName,
                    this.__metadata && this.__metadata.id ? ' of the object "{0}"'.format(this.__metadata.id) : '',
                    interfaceName
                )
            );
        }

        Object.defineProperty(proxy, propertyName, propertyDescriptor);
    } else {
        var descriptor = Object.getPropertyDescriptor(prototype, propertyName),
            getterType = self._interfacesRegistry.getGetter(interfaceName, propertyName)
        ;

        propertyDescriptor.get = function() {
            var value;

            if (descriptor) {
                if (descriptor.get) {
                    value = descriptor.get.call(prototype);
                } else {
                    value = descriptor.value;
                }
            }

            value = prototype[propertyName];

            try {
                Object.checkType(value, getterType);
            } catch (error) {
                if (error.instead) {
                    throw new Error(
                        'The getter "{0}"{1} defined by the interface "{2}" returns {3}; {4} given instead.'.format(
                            propertyName,
                            this.__metadata && this.__metadata.id ? ' of "{0}"'.format(this.__metadata.id) : '',
                            interfaceName,
                            error.expected,
                            error.instead
                        )
                    );
                }

                throw error;
            }

            return value;
        }

        Object.defineProperty(proxy, propertyName, propertyDescriptor);
    }

    if (!hasSetter) {
        propertyDescriptor.set = function() {
            throw new Error(
                'The setter of the property "{0}"{1} is not accessible in the scope of the interface "{2}".'.format(
                    propertyName,
                    this.__metadata && this.__metadata.id ? ' of the object "{0}"'.format(this.__metadata.id) : '',
                    interfaceName
                )
            );
        }

        Object.defineProperty(proxy, propertyName, propertyDescriptor);
    } else {
        var setterType = self._interfacesRegistry.getSetter(interfaceName, propertyName);

        propertyDescriptor.set = function(value) {
            try {
                Object.checkType(value, setterType);
            } catch (error) {
                if (error.instead) {
                    throw new Error(
                        'The setter "{0}"{1} defined by the interface "{2}" takes {3}; {4} given instead.'.format(
                            propertyName,
                            this.__metadata && this.__metadata.id ? ' of "{0}"'.format(this.__metadata.id) : '',
                            interfaceName,
                            error.expected,
                            error.instead
                        )
                    );
                }

                throw error;
            }

            var descriptor = Object.getPropertyDescriptor(prototype, propertyName);

            if (descriptor) {
                if (descriptor.set) {
                    descriptor.set.call(prototype, value);
                } else {
                    descriptor.value = value;
                }
            } else {
                prototype[propertyName] = value;
            }
        }

        Object.defineProperty(proxy, propertyName, propertyDescriptor);
    }
}

/**
 * Check the arguments of a method (implementation of an interface).
 *
 * @param {String} methodName The name of the method.
 * @param {String} methodInterfaceName The name of the interface of the implemented method.
 * @param {Array} methodArgTypes The types of the arguments accepted by the method.
 * @param {Array} args The input arguments.
 * @throws {Error} if one of the argument has a wrong type.
 * @api private
 */
var checkMethodArguments = function (methodName, methodInterfaceName, methodArgTypes, args) {
    var argsNumber = methodArgTypes.length,
        minArgsNumber = 0,
        hasVariableArgsNumber = false
    ;

    for (var i = 0; i < argsNumber; i++) {
        var methodArgType = methodArgTypes[i].split('/'),
            argTypes = methodArgType[0].split('|'),
            argName = methodArgType[1] ? methodArgType[1] : '',
            optional = false
        ;

        for (var j = 0; j < argTypes.length; j++) {
            if ('undefined' === argTypes[j]) {
                optional = true;

                break;
            }
            if (-1 !== argTypes[j].indexOf('...')) {
                hasVariableArgsNumber = true;
            }
        }

        if (!optional) {
            minArgsNumber = i + 1;
        }
    }

    if (!hasVariableArgsNumber && (minArgsNumber > args.length || argsNumber < args.length)) {
        throw new Error(
            'The method "{0}"{1} defined by the interface "{2}" takes {3} arguments; {4} given instead.'.format(
                methodName,
                this.__metadata && this.__metadata.id ? ' of "{0}"'.format(this.__metadata.id) : '',
                methodInterfaceName,
                argsNumber,
                args.length
            )
        );
    }

    var followedType = '',
        k = 0
    ;

    // Check argument types (handling variable parameters).
    for (var i = 0; i < argsNumber; i++) {
        try {
            var methodArgType = methodArgTypes[k].split('/'),
                argType = methodArgType[0],
                argName = methodArgType[1] ? methodArgType[1] : '',
                variableArgs = {}
            ;

            if (followedType) {
                argType = [argType, followedType].join('|');
                variableArgs[followedType.replace(/\.\.\./g, '')] = true;
            }

            if (-1 !== argType.indexOf('...')) {
                var argTypes = methodArgType[0].split('|');

                for (var j = 0; j < argTypes.length; j++) {
                    if (-1 !== argTypes[j].indexOf('...')) {
                        variableArgs[argTypes[j].replace(/\.\.\./g, '')] = true;
                    }
                }
            }

            var result = Object.checkType(args[i], argType.replace(/\.\.\./g, ''));

            if (result.matchedType in variableArgs) {
                var newFollowedType = '{0}...'.format(result.matchedType);

                if (newFollowedType !== followedType) {
                    followedType = newFollowedType;
                    k++;
                } else {
                    argsNumber++;
                }
            } else {
                k++;
                followedType = '';
            }
        } catch (error) {
            if (error.instead) {
                throw new Error(
                    'The method "{0}"{1} defined by the interface "{2}" takes {3} as argument {4}; {5} given instead.'.format(
                        methodName,
                        this.__metadata && this.__metadata.id ? ' of "{0}"'.format(this.__metadata.id) : '',
                        methodInterfaceName,
                        error.expected,
                        argName ? '{0} ({1})'.format(i, argName) : i,
                        error.instead
                    )
                );
            }

            throw error;
        }
    }
}