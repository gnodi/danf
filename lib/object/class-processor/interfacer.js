'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new interfacer class processor.
     *
     * @param {danf:object.interfacesRegistry} interfacesRegistry The interfaces registry.
     */
    function Interfacer(interfacesRegistry) {
        if (interfacesRegistry) {
            this.interfacesRegistry = interfacesRegistry;
        }
    }

    Interfacer.defineImplementedInterfaces(['danf:object.classProcessor']);

    Interfacer.defineDependency('_interfacesRegistry', 'danf:object.interfacesRegistry');

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
     * @interface {danf:object.classProcessor}
     */
    Object.defineProperty(Interfacer.prototype, 'order', {
        value: 1200
    });

    /**
     * @interface {danf:object.classProcessor}
     */
    Interfacer.prototype.process = function (class_) {
        var methodDeclarations = [],
            interfaceNames = '',
            self = this,
            implementedInterfaces
        ;

        // Do not check abstract classes.
        if (class_.__metadata && class_.__metadata.abstract) {
            return;
        } else if (class_.constructor && class_.constructor.__metadata.abstract) {
            return;
        }

        if (class_.__metadata) {
            implementedInterfaces = class_.__metadata.implements;
        } else if (class_.constructor) {
            implementedInterfaces = class_.constructor.__metadata.implements;
        }

        // Check that all the methods, getters and setters of the implemented interfaces are implemented
        // and add a proxy to ensure the respect of the interfaces.
        if (implementedInterfaces) {
            Object.checkType(implementedInterfaces, 'string_array');

            var interfaces = [];

            for (var i = 0; i < implementedInterfaces.length; i++) {
                var interfaceName = implementedInterfaces[i],
                    interface_ = this._interfacesRegistry.get(interfaceName)
                ;

                checkMethods(class_, interfaceName, interface_.methods);
                checkGetters(class_, interfaceName, interface_.getters);
                checkSetters(class_, interfaceName, interface_.setters);

                var extendedInterfaces = [];

                while (interface_.extends) {
                    extendedInterfaces.push(interface_.extends);

                    interface_ = this._interfacesRegistry.get(interface_.extends);
                }

                interfaces = interfaces.concat(extendedInterfaces);
            }

            implementedInterfaces = implementedInterfaces.concat(interfaces);

            var uniqueImplementedInterfaces = [];

            for (var i = 0; i < implementedInterfaces.length; i++) {
                if (-1 == uniqueImplementedInterfaces.indexOf(implementedInterfaces[i])) {
                    uniqueImplementedInterfaces.push(implementedInterfaces[i]);
                }
            }

            if (class_.__metadata) {
                class_.__metadata.implements = uniqueImplementedInterfaces;
            } else if (class_.constructor) {
                class_.constructor.__metadata.implements = uniqueImplementedInterfaces;
            }
        }
    }

    /**
     * Check the implemented methods.
     *
     * @param {function} class_ The class function.
     * @param {string} interfaceName The name of the interface.
     * @param {object} methods The definitions of the methods.
     * @api private
     */
    var checkMethods = function(class_, interfaceName, methods) {
        if (methods) {
            for (var methodName in methods) {
                var methodDefinition = methods[methodName];

                if (!class_.prototype[methodName]) {
                    throw new Error(
                        'The method "{0}" defined by the interface "{1}" must be implemented{2}.'.format(
                            methodName,
                            interfaceName,
                            class_.__metadata.id ? ' by the class "{0}"'.format(class_.__metadata.id) : ''
                        )
                    );
                }
            }
        }
    }

    /**
     * Check the implemented getters.
     *
     * @param {function} class_ The class function.
     * @param {string} interfaceName The name of the interface.
     * @param {object} getters The definitions of the getters.
     * @api private
     */
    var checkGetters = function(class_, interfaceName, getters) {
        if (getters) {
            for (var getterName in getters) {
                if (!Object.hasGetter(class_.prototype, getterName)) {
                    throw new Error(
                        'The getter "{0}" defined by the interface "{1}" must be implemented{2}.'.format(
                            getterName,
                            interfaceName,
                            class_.__metadata.id ? ' by the class "{0}"'.format(class_.__metadata.id) : ''
                        )
                    );
                }
            }
        }
    }

    /**
     * Check the implemented setters.
     *
     * @param {function} class_ The class function.
     * @param {string} interfaceName The name of the interface.
     * @param {object} setters The definitions of the setters.
     * @api private
     */
    var checkSetters = function(class_, interfaceName, setters) {
        if (setters) {
            for (var setterName in setters) {
                if (!Object.hasSetter(class_.prototype, setterName)) {
                    throw new Error(
                        'The setter "{0}" defined by the interface "{1}" must be implemented{2}.'.format(
                            setterName,
                            interfaceName,
                            class_.__metadata.id ? ' by the class "{0}"'.format(class_.__metadata.id) : ''
                        )
                    );
                }
            }
        }
    }

    /**
     * Expose `Interfacer`.
     */
    return Interfacer;
});