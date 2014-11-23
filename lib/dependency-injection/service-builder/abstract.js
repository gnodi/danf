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
     * Initialize a new abstract service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Abstract(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._instantiateOrder = 800;
    }

    utils.extend(AbstractServiceBuilder, Abstract);

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Abstract.prototype, 'contract', {
        value: {
            abstract: {
                type: 'boolean'
            }
        }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Abstract.prototype.instantiate = function(instance, definition) {
        if (definition.abstract) {
            throw new Error(
                'The service of id "{0}" is an abstract service and cannot be instantiated.'.format(
                    definition.id
                )
            );
        }

        return instance;
    }

    /**
     * Expose `Abstract`.
     */
    return Abstract;
});