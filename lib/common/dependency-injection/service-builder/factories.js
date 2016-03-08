'use strict';

/**
 * Expose `Factories`.
 */
module.exports = Factories;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new factories service builder.
 */
function Factories() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1200;
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
                    embed: utils.clone(contract)
                };
            }
        };
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Factories.prototype.resolve = function(definition) {
    if (definition.factories) {
        if (false !== definition.abstract) {
            definition.abstract = true;
        }

        for (var factoryName in definition.factories) {
            var factory = definition.factories[factoryName],
                factoryService = this._servicesContainer.mergeDefinitions(definition, factory)
            ;

            factoryService.factories = factory.factories;

            definition.factories[factoryName] = factoryService;
        }
    }

    return definition;
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