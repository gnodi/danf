'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = require('../../utils'),
        AbstractServiceBuilder = require('./abstract-service-builder')
    ;

    /**
     * Initialize a new factories service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Factories(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._defineOrder = 1600;
        this._instantiateOrder = 1800;
    }

    utils.extend(AbstractServiceBuilder, Factories);

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Factories.prototype, 'contract', {
        get: function () {
            return {
                factories: function(contract) {
                    return {
                        type: 'embedded_object',
                        embed: {
                            class: contract.class,
                            properties: contract.properties,
                            abstract: contract.abstract,
                            tags: contract.tags
                        }
                    };
                }
            };
        }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Factories.prototype.define = function(service) {
        if (service.factories) {
            service.abstract = true;

            for (var factoryName in service.factories) {
                var factory = service.factories[factoryName],
                    factoryServiceId = '{0}._factory.{1}'.format(service.id, factoryName)
                ;

                var factoryService = this._servicesContainer.mergeDefinitions(service, factory);

                factoryService.declinationParent = service.id;
                factoryService.factories = factory.factories;
                factoryService.parent = service.parent;
                factoryService.abstract = true;

                this._servicesContainer.setDefinition(factoryServiceId, factoryService);

                service.factories[factoryName] = factoryServiceId;
            }
        }

        return service;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Factories.prototype.merge = function(parent, child) {
        if (null == child.factories && null != parent.factories) {
            child.factories = utils.clone(parent.factories);
        }

        return child;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Factories.prototype.instantiate = function(instance, definition) {
        for (var propertyName in definition.properties) {
            var propertyValue = definition.properties[propertyName];

            if (Array.isArray(propertyValue)) {
                for (var i = 0; i < propertyValue.length; i++) {
                    if ('string' === typeof propertyValue[i]) {
                        propertyValue[i] = buildServiceFromFactory.call(this, definition, propertyValue[i], '{0}.{1}'.format(propertyName, i));
                    }
                }
            } else if ('string' === typeof propertyValue) {
                propertyValue = buildServiceFromFactory.call(this, definition, propertyValue, propertyName);
            }

            definition.properties[propertyName] = propertyValue;
        }

        return instance;
    }

    /**
     * Build a service from a factory.
     *
     * @param {string} definition The definition of the service owning the reference.
     * @param {string} source The string where the factory may occur.
     * @param {string} key The key for the service id.
     * @return {mixed} The instantiation of the service or the initial source if no factory found.
     * @api private
     */
    var buildServiceFromFactory = function(definition, source, key) {
        var factory = this._referenceResolver.extract(
                source,
                '>',
                'the definition of the service "{0}"'.format(definition.id)
            )
        ;

        if (factory) {
            var serviceId = factory[0],
                factoryName = factory[1],
                declinations = factory[2]
            ;

            if (!this._servicesContainer.hasDefinition(serviceId)) {
                throw new Error(
                    'The service of id "{0}" has a dependency on a not defined service "{1}".'.format(
                        definition.id,
                        serviceId
                    )
                );
            }

            var serviceDefinition = this._servicesContainer.getDefinition(serviceId);

            if (!serviceDefinition.factories || !serviceDefinition.factories[factoryName]) {
                throw new Error(
                    'The service of id "{0}" uses the factory "{1}" of the service "{2}" which is not defined.'.format(
                        definition.id,
                        factoryName,
                        serviceId
                    )
                );
            }

            var factoryDefinition = this._servicesContainer.getDefinition(serviceDefinition.factories[factoryName]),
                manufactoredServiceDefinition = utils.clone(factoryDefinition),
                manufactoredServiceId = '{0}.{1}'.format(definition.id, key)
            ;

            // Parse optional declinations.
            if (declinations) {
                // References coming from the declinations.
                // Factory case.
                if (definition.declinations && false === definition.abstract) {
                    declinations = this._referenceResolver.resolve(
                        declinations,
                        '@',
                        definition.declinations,
                        'the definition of the service "{0}"'.format(definition.id)
                    );
                }
                // Config case.
                if (definition.declinationParent) {
                    var parentDefinition = this._servicesContainer.getDefinition(definition.declinationParent);

                    if (parentDefinition.declinations) {
                        declinations = this._referenceResolver.resolve(
                            declinations,
                            '@',
                            parentDefinition.declinations[definition.key],
                            'the definition of the service "{0}"'.format(definition.id)
                        );

                        // References coming from the config.
                        if ('object' !== typeof declinations) {
                            declinations = this._referenceResolver.resolve(
                                declinations,
                                '$',
                                this._servicesContainer.config,
                                'the definition of the service "{0}"'.format(definition.id)
                            );
                        }
                    }
                }

                manufactoredServiceDefinition.declinations = declinations;
            }

            this._servicesContainer.setDefinition(manufactoredServiceId, manufactoredServiceDefinition);
            manufactoredServiceDefinition.abstract = false;

            return this._servicesContainer.get(manufactoredServiceId);
        }

        return source;
    }

    /**
     * Expose `Factories`.
     */
    return Factories;
});