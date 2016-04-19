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
Induced.prototype.define = function(definition) {
    // Prepare induced services definitions.
    if (definition.induced && !definition.abstract) {
        for (var key in definition.induced) {
            var induced = utils.clone(definition.induced[key]),
                inducedServiceId = '{0}.{1}'.format(definition.id, key),
                factoryServiceId = '{0}._factory.{1}'.format(
                    induced.definition,
                    induced.factory
                )
            ;

            if (undefined === this._inducedDefinitions[factoryServiceId]) {
                this._inducedDefinitions[factoryServiceId] = [];
            }

            var factoryService = this._servicesContainer.getDefinition(induced.service);

            if (!factoryService.factories || null == factoryService.factories[induced.factory]) {
                throw new Error(
                    'Induced services "{0}" have not been instantiated because there is no factory "{1}" in the service "{2}".'.format(
                        inducedServiceId,
                        induced.factory,
                        induced.service
                    )
                );
            }

            var inducedService = utils.clone(factoryService.factories[induced.factory]);

            inducedService.id = inducedServiceId;

            if (null == inducedService.collections) {
                inducedService.collections = [];
            }
            inducedService.collections.push(inducedServiceId);

            if (induced.context) {
                inducedService = this._referenceResolver.resolve(
                    inducedService,
                    '!',
                    induced.context,
                    'the definition of the service "{0}"'.format(inducedService.id)
                );
            }

            this._servicesContainer.setDefinition(inducedService.id, inducedService);

            // Set property injection.
            if (induced.property) {
                if (null == definition.properties) {
                    definition.properties = {};
                }

                definition.properties[induced.property] = '{0}{1}{0}'.format(
                    induced.collection ? '&' : '#',
                    inducedServiceId
                );
            }
        }
    }

    return definition;
}