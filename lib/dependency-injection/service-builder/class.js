'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../utils'),
        AbstractServiceBuilder = module.isClient ? require('danf/dependency-injection/service-builder/abstract-service-builder') : require('./abstract-service-builder')
    ;

    /**
     * Initialize a new class service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Class(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._instantiateOrder = 1000;
    }

    utils.extend(AbstractServiceBuilder, Class);

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Class.prototype, 'contract', {
        value: {
            class: {
                type: 'function'
            }
        }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Class.prototype.merge = function(parent, child) {
        if (null == child.class) {
            child.class = parent.class;
        }

        return child;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Class.prototype.instantiate = function(instance, definition) {
        if (!definition.class) {
            throw new Error(
                'The service "{0}" should define the class parameter.'.format(
                    definition.id
                )
            );
        }

        // Do not allow instantiation of abstract classes.
        if (definition.class.__metadata.abstract) {
            throw new Error(
                'The service "{0}" could not be instantiated because its class "{1}" is an abstract class.'.format(
                    definition.id,
                    definition.class.__metadata.id
                )
            );
        }

        if (null == instance) {
            instance = new definition.class();
        }

        if (undefined === instance.__metadata) {
            Object.defineProperty(instance, '__metadata', {
                get: function() { return this.__metadata__; },
                set: function(metadata) { this.__metadata__ = metadata; },
                enumerable: false
            });

            instance.__metadata = {
                id: definition.id,
                class: definition.class.__metadata.id,
                module: definition.class.__metadata.module,
                implements: definition.class.__metadata.implements || [],
                dependencies: definition.class.__metadata.dependencies || {}
            };
        }

        return instance;
    }

    /**
     * Expose `Class`.
     */
    return Class;
});