'use strict';

/**
 * Expose `Sequences`.
 */
module.exports = Sequences;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

utils.extend(SectionProcessor, Sequences);

/**
 * Initialize a new section processor sequences for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function Sequences(name, configurationResolver, referenceResolver, namespacer) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);

    this.contract = {
        __any: {
            condition: {
                type: 'function|undefined'
            },
            service: {
                type: 'string',
                required: true,
                namespace: true
            },
            method: {
                type: 'string',
                required: true
            },
            arguments: {
                type: 'mixed_array',
                default: []
            },
            returns: {
                type: 'string'
            }
        },
        type: 'embedded_array',
        namespace: true,
        references: ['$']
    };
}