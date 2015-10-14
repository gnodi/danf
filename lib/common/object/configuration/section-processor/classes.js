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
 * Initialize a new section processor classes for the config.
 */
function Classes(name) {
    SectionProcessor.call(this);

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
                var dependency = class_.__metadata.dependencies[property],
                    types = dependency.type.split('|')
                ;

                for (var i = 0; i < types.length; i++) {
                    if (Object.isInterfaceType(types[i])) {
                        types[i] = this._namespacer.prefix(types[i], module, modulesTree);
                    }
                }

                dependency.type = types.join('|');

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