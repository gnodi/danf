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
 * Initialize a new input sequence interpreter.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.dataResolver} The data resolver.
 */
function Input(sequencesContainer, dataResolver) {
    Abstract.call(this, sequencesContainer);

    this._order = 800;
    if (dataResolver) {
        this.dataResolver = dataResolver;
    }
}

utils.extend(Abstract, Input);

/**
 * Set the data resolver.
 *
 * @param {danf:manipulation.dataResolver} The data resolver.
 * @api public
 */
Object.defineProperty(Input.prototype, 'dataResolver', {
    set: function(dataResolver) {
        this._dataResolver = dataResolver
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Input.prototype, 'contract', {
    value: {
        input: {
            type: 'string',
            namespace: true
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
 Input.prototype.interpret = function(interpretation, definition, context) {
    if (definition.input) {
        interpretation.unshift({
            order: null,
            operations: [interpretInput.call(this, definition.input, definition.id, definition)]
        });
    }

    return interpretation;
}

/**
 * Interpret an input
 *
 * @param {object} input The definition of the input.
 * @param {string} id The identifier of the sequence.
 * @param {mixed_object} defintion The definition of the sequence.
 * @return {function} The interpreted input.
 */
var interpretInput = function(input, id, definition) {
    var self = this;

    return function(flow, callback) {
        definition.input = self._dataResolver.resolve(
            flow.stream,
            input,
            'sequence[{0}]'.format(id)
        );

        callback();
    };
}
