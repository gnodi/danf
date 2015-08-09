'use strict';

/**
 * Expose `Parameters`.
 */
module.exports = Parameters;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    SectionProcessor = require('../section-processor')
;

/**
 * Initialize a new section processor Parameters for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function Parameters(name, configurationResolver, referenceResolver, namespacer) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver, namespacer);

    this._priority = true;
    this.contract = {
        __any: null,
        type: 'mixed',
        namespace: true
    };
}

utils.extend(SectionProcessor, Parameters);

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Parameters.prototype.preProcess = function(config, sectionConfig, modulesTree) {
    return this.resolveReferences(config, '%', sectionConfig);
}

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Parameters.prototype.postProcess = function(config, sectionConfig, modulesTree) {
    return this.resolveReferences(config, '%', sectionConfig, modulesTree);
}

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Parameters.prototype.interpretAllModuleConfig = function(config, module, modulesTree) {
    if (undefined === module.alias) {
        config = this._namespacer.prefixReferences(config, '%', module, modulesTree);
    }

    return config;
}