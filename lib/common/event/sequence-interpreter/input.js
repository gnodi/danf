'use strict';

/**
 * Expose `Input`.
 */
module.exports = Input;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new input sequence builder.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Input(sequencesContainer, referenceResolver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._order = 800;
}

utils.extend(Abstract, Input);

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Input.prototype, 'contract', {
    value: {
        input: {
            type: 'string',
            namespaces: true
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Input.prototype.interpret = function(sequence) {
    if (sequence.input) {
    }

    return sequence;
}
