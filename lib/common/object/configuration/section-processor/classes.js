'use strict';

/**
 * Expose `Classes`.
 */
module.exports = Classes;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

/**
 * Initialize a new section processor Classes for the config.
 *
 * @param {string} name The name of the section.
 * @param {danf:configuration.configurationResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 */
function Classes(name, configurationResolver, referenceResolver) {
    SectionProcessor.call(this, name, null, configurationResolver, referenceResolver);

    this.contract = {
        __any: null,
        type: 'function',
        namespace: true,
        flatten: '.'
    };
}

utils.extend(SectionProcessor, Classes);

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Classes.prototype.interpretModuleConfig = function(config, module, modulesTree) {
    for (var className in config) {
        var class_ = config[className];

        if (class_.__metadata.dependencies) {
            for (var property in class_.__metadata.dependencies) {
                var dependency = class_.__metadata.dependencies[property];

                if (Object.isInterfaceType(dependency.type)) {
                    dependency.type = this._namespacer.prefix(dependency.type, module, modulesTree);
                }

                if (dependency.providedType) {
                    if (Object.isInterfaceType(dependency.providedType)) {
                        dependency.providedType = this._namespacer.prefix(dependency.providedType, module, modulesTree);
                    }
                }
            }
        }

        if (class_.__metadata.extends) {
            class_.__metadata.extends = this._namespacer.prefix(class_.__metadata.extends, module, modulesTree);
        }

        if (class_.__metadata.implements) {
            for (var i = 0; i < class_.__metadata.implements.length; i++) {
                class_.__metadata.implements[i] = this._namespacer.prefix(class_.__metadata.implements[i], module, modulesTree);
            }
        }

        class_.__metadata.module = module.id;
    }

    return config;
}