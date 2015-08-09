'use strict';

/**
 * Expose `Services`.
 */
module.exports = Services;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

/**
 * Initialize a new section processor Services for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 * @param {danf:dependencyInjection.servicesContainer} servicesContainer The services container.
 */
function Services(name, configurationResolver, referenceResolver, namespacer, servicesContainer) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer, servicesContainer);

    if (servicesContainer) {
        this.servicesContainer = servicesContainer;
    }
}

utils.extend(SectionProcessor, Services);

Services.defineDependency('_servicesContainer', 'danf:dependencyInjection.servicesContainer');

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Object.defineProperty(Services.prototype, 'contract', {
    get: function() {
        var handledParameters = this._servicesContainer.handledParameters;

        this._contract = {
            __any: buildContract(handledParameters),
            type: 'embedded',
            namespace: true,
            references: ['#', '$', '&', '>']
        };

        return this._contract;
    },
    set: function(contract) { this._contract = contract }
});

/**
 * Set the notifiers.
 *
 * @return {danf:event.notifier_array}
 * @api public
 */
Object.defineProperty(Services.prototype, 'servicesContainer', {
    set: function(servicesContainer) { this._servicesContainer = servicesContainer; }
});

/**
 * Build the contract from handled parameters.
 *
 * @param {object} handledParameters The handled parameters.
 * @return {object} The contract.
 * @api private
 */
var buildContract = function(handledParameters) {
    var contract = {
            'lock': {
                type: 'boolean',
                default: false
            }
        }
    ;

    for (var key in handledParameters) {
        var parameter = handledParameters[key];

        if ('function' === typeof parameter) {
            contract[key] = parameter(handledParameters);
        } else {
            contract[key] = parameter;
        }
    }

    return contract;
}