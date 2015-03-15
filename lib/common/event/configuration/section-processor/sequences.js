'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = require('../../../utils'),
        SectionProcessor = require('../../../configuration/section-processor')
    ;

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
                    namespaces: true
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
            namespaces: true,
            references: ['$']
        };
    }

    utils.extend(SectionProcessor, Sequences);

    /**
     * Expose `Sequences`.
     */
    return Sequences;
});