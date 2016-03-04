'use strict';

/**
 * Expose `Induced`.
 */
module.exports = Induced;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new induced service builder.
 */
function Induced() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 2000;
    this._instantiateOrder = 1400;

    this._inducedDefinitions = {};
}

utils.extend(AbstractServiceBuilder, Induced);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Induced.prototype, 'contract', {
    value: {
        induced: {
            type: 'embedded_object',
            embed: {
                service: {
                    type: 'string',
                    required: true,
                    namespace: true
                },
                factory: {
                    type: 'string',
                    required: true
                },
                context: {
                    type: 'mixed',
                    default: {}
                },
                property: {
                    type: 'string'
                },
                collection: {
                    type: 'boolean',
                    default: true
                }
            }
        }
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Induced.prototype.define = function(service) {
    // Prepare induced services definitions.
    if (service.induced && !service.abstract) {
        for (var key in service.induced) {
            var induced = utils.clone(service.induced[key]),
                incudedServiceId = '{0}.{1}'.format(service.id, key),
                factoryServiceId = '{0}._factory.{1}'.format(
                    induced.service,
                    induced.factory
                ),
                inducedService = {
                    parent: factoryServiceId,
                    factoryContext: induced.context || {},
                    abstract: false,
                    collections: [incudedServiceId]
                }
            ;

            if (undefined === this._inducedDefinitions[factoryServiceId]) {
                this._inducedDefinitions[factoryServiceId] = [];
            }
            inducedService.id = incudedServiceId;
            this._inducedDefinitions[factoryServiceId].push(inducedService);

            // Set property injection.
            if (induced.property) {
                if (null == service.properties) {
                    service.properties = {};
                }

                service.properties[induced.property] = '{0}{1}{0}'.format(
                    induced.collections ? '&' : '#',
                    incudedServiceId
                );
            }
        }
    }

    // Set induced services definitions.
    if (service.id in this._inducedDefinitions) {
        for (var i = 0; i < this._inducedDefinitions[service.id].length; i++) {
            var inducedService = this._inducedDefinitions[service.id][i];

            this._servicesContainer.setDefinition(incudedService.id, inducedService);
        }

        delete this._inducedDefinitions[service.id];
    }

    return service;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Induced.prototype.finalize = function(instance, definition) {
    for (var serviceId in this._inducedDefinitions) {
        throw new Error(
            'Some induced services have not been instantiated because the factory "{0}" does not exist.'.format(
                serviceId
            )
        )
    }
}