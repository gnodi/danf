'use strict';

/**
 * Expose `Parents`.
 */
module.exports = Parents;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new parents sequence builder.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Parents(sequencesContainer, referenceResolver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._order = 1400;
}

utils.extend(Abstract, Parents);

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Parents.prototype, 'contract', {
    value: {
        parents: {
            type: 'embedded_array',
            embed: {
                condition: {
                    type: 'function'
                },
                order: {
                    type: 'number',
                    default: 0
                },
                name: {
                    type: 'string',
                    required: true
                },
                input: {
                    type: 'mixed_object',
                    default: {}
                },
                output: {
                    type: 'mixed_object',
                    default: {}
                }
            }
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Parents.prototype.interpret = function(sequence) {
    if (sequence.parents) {
    }

    return sequence;
}
