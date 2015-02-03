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
     * Initialize a new declinations service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Declinations(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._defineOrder = 1200;
        this._instantiateOrder = 1400;
    }

    utils.extend(AbstractServiceBuilder, Declinations);

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Declinations.prototype, 'contract', {
        value: {
            declinations: {
                type: 'mixed'
            },
            key: {
                type: 'string|number'
            },
            declinationParent: {
                type: 'string'
            }
        }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Declinations.prototype.define = function(service) {
        if (service.declinations) {
            if (service.children) {
                throw new Error(
                    'The service "{0}" cannot define both the declinations and children parameters.'.format(
                        service.id
                    )
                );
            }

            service.abstract = true;

            if ('string' === typeof service.declinations) {
                service.declinations = this._referenceResolver.resolve(
                    service.declinations,
                    '$',
                    this._servicesContainer.config,
                    'the definition of the service "{0}"'.format(service.id)
                );
            }

            if ('object' !== typeof service.declinations) {
                throw new Error(
                    'The declinations parameter of the service "{0}" should be an array.'.format(
                        service.id
                    )
                );
            }

            for (var key in service.declinations) {
                var declination = service.declinations[key],
                    declinationId = key
                ;

                if ('object' === typeof declination && !Array.isArray(declination)) {
                    service.declinations[key]['_'] = key;
                }

                if (Array.isArray(declination)) {
                    declinationId = declination;
                }

                if (null != service.key) {
                    declinationId = this._referenceResolver.resolve(
                        service.key,
                        '@',
                        declination,
                        'the definition of the service "{0}"'.format(service.id)
                    );
                }

                var declinationService = utils.clone(service);

                declinationService.declinations = null;
                declinationService.key = key;
                declinationService.abstract = false;
                declinationService.declinationParent = service.id;

                this._servicesContainer.setDefinition('{0}.{1}'.format(service.id, declinationId), declinationService);
            }
        }

        return service;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Declinations.prototype.instantiate = function(instance, definition) {
        for (var propertyName in definition.properties) {
            var propertyValue = definition.properties[propertyName];

            // References coming from the declinations.
            // Factory case.
            if (definition.declinations && !definition.abstract) {
                propertyValue = this._referenceResolver.resolve(
                    propertyValue,
                    '@',
                    definition.declinations,
                    'the definition of the service "{0}"'.format(definition.id)
                );
            }
            // Config case.
            if (definition.declinationParent) {
                var parentDefinition = this._servicesContainer.getDefinition(definition.declinationParent);

                if (parentDefinition.declinations) {
                    propertyValue = this._referenceResolver.resolve(
                        propertyValue,
                        '@',
                        parentDefinition.declinations[definition.key],
                        'the definition of the service "{0}"'.format(definition.id)
                    );
                }
            }

            definition.properties[propertyName] = propertyValue;
        }

        return instance;
    }

    /**
     * Expose `Declinations`.
     */
    return Declinations;
});