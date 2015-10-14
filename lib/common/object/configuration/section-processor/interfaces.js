'use strict';

/**
 * Expose `Interfaces`.
 */
module.exports = Interfaces;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    SectionProcessor = require('../../../configuration/section-processor')
;

utils.extend(SectionProcessor, Interfaces);

/**
 * Initialize a new section processor interfaces for the config.
 */
function Interfaces() {
    SectionProcessor.call(this);

    this.contract = {
        __any: {
            extends: {
                type: 'string'
            },
            methods: {
                type: 'embedded_object',
                embed: {
                    arguments: {
                        type: 'string_array',
                        default: []
                    },
                    returns: {
                        type: 'string'
                    }
                },
                default: {}
            },
            getters: {
                type: 'string_object',
                default: {}
            },
            setters: {
                type: 'string_object',
                default: {}
            }
        },
        type: 'embedded',
        namespace: true
    };
}

/**
 * @interface {danf:configuration.sectionProcessor}
 */
Interfaces.prototype.interpretModuleConfig = function(config, module, modulesTree) {
    for (var interfaceName in config) {
        var interface_ = config[interfaceName];

        // Handle method arguments namespacing.
        if (interface_.methods) {
            for (var name in interface_.methods) {
                var method = interface_.methods[name];

                if (method.arguments) {
                    for (var i = 0; i < method.arguments.length; i++) {
                        method.arguments[i] = namespaceType.call(
                            this,
                            method.arguments[i],
                            module,
                            modulesTree
                        );
                    }
                }
            }
        }

        // Handle getters namespacing.
        if (interface_.getters) {
            for (var name in interface_.getters) {
                interface_.getters[name] = namespaceType.call(
                    this,
                    interface_.getters[name],
                    module,
                    modulesTree
                );
            }
        }

        // Handle setters namespacing.
        if (interface_.setters) {
            for (var name in interface_.setters) {
                interface_.setters[name] = namespaceType.call(
                    this,
                    interface_.setters[name],
                    module,
                    modulesTree
                );
            }
        }
    }

    return config;
}

/**
 * Namespace a type.
 *
 * @param {string} type The type.
 * @param {danf:configuration.module} module The module.
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @return {string} The namespaced type.
 * @api private
 */
var namespaceType = function(type, module, modulesTree) {
    var argument = type.split('/'),
        types = argument[0].split('|')
    ;

    for (var i = 0; i < types.length; i++) {
        if (Object.isInterfaceType(types[i])) {
            types[i] = this._namespacer.prefix(types[i], module, modulesTree);
        }
    }

    type = types.join('|');

    return argument[1] ? '{0}/{1}'.format(type, argument[1]) : type;
}