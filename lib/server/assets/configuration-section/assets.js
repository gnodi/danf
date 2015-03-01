'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../common/configuration/section-processor')
;

/**
 * Expose `Assets`.
 */
module.exports = Assets;

/**
 * Initialize a new section processor Assets for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function Assets(name, configurationResolver, referenceResolver, namespacer) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);

    this.contract = {
        __any: {},
        type: 'string'
    };
}

utils.extend(SectionProcessor, Assets);