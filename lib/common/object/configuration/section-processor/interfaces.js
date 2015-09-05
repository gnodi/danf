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