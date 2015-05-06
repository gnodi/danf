'use strict';

/**
 * Expose `Operations`.
 */
module.exports = Operations;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new operations sequence builder.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Operations(sequencesContainer, referenceResolver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._interpretationOrder = 1000;
}

utils.extend(Abstract, Operations);

/**
 * @interface {danf:dependencyInjection.sequenceBuilder}
 */
Object.defineProperty(Operations.prototype, 'contract', {
    value: {
        operations: {
            type: 'embedded_array',
            embed: {
                condition: {
                    type: 'function'
                },
                order: {
                    type: 'number',
                    default: 0
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
            }
        }
    }
});

/**
 * @interface {danf:dependencyInjection.sequenceBuilder}
 */
Operations.prototype.interpret = function(sequence) {
    if (sequence.operations) {
    }

    return sequence;
}