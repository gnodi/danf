'use strict';

/**
 * Expose `Registry`.
 */
module.exports = Registry;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new registry service builder.
 */
function Registry() {
    AbstractServiceBuilder.call(this);

    this._instantiateOrder = 1400;
}

utils.extend(AbstractServiceBuilder, Registry);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Registry.prototype, 'contract', {
    value: {
        registry: {
            type: 'embedded',
            embed: {
                method: {
                    type: 'string',
                    required: true
                },
                namespace: {
                    type: 'boolean|number_array',
                    default: false
                }
            }
        }
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Registry.prototype.merge = function(parent, child) {
    if (null == child.registry) {
        child.registry = parent.registry;
    }

    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Registry.prototype.instantiate = function(instance, definition) {
    if (definition.registry) {
        var registryMethod = instance[definition.registry.method];

        if ('function' !== typeof registryMethod) {
            throw new Error(
                'The service of id "{0}" should define the registry method "{1}".'.format(
                    definition.id,
                    definition.registry.method
                )
            );
        }
    }

    return instance;
}