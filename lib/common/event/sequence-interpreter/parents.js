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
Parents.prototype.interpret = function(interpretation, definition) {
    if (definition.parents) {
        for (var i = 0; i < definition.parents.length; i++) {
            var operations = [],
                parent = definition.parents[i],
                order = parent.order,
                parentInterpretation = this._sequencesContainer.getInterpretation(parent.name)
            ;

            for (var j = 0; j < parentInterpretation.length; j++) {
                if (parentInterpretation[j].order === order) {
                    operations = parentInterpretation[j].operations;
                    break;
                } else if (parentInterpretation[j].order > order) {
                    break;
                }
            }

            if (0 === operations.length) {
                if (j === operations.length - 1) {
                    parentInterpretation.push(
                        {
                            order: order,
                            operations: operations
                        }
                    );
                } else {
                    parentInterpretation.splice(
                        j,
                        0,
                        {
                            order: order,
                            operations: operations
                        }
                    );
                }
            }

            operations.push(interpretParent.call(this, parent, definition.id));
        }
    }

    return interpretation;
}

/**
 * Interpret a parent.
 *
 * @param {object} parent The definition of the parent sequence.
 * @param {string} id The identifier of the sequence.
 * @return {function} The interpreted parent.
 */
var interpretParent = function(parent, id) {
    var self = this;

    return function(flow, callback) {
        // Check optional condition.
        if (parent.condition) {
            if (!parent.condition(flow.currentStream)) {
                return;
            }
        }

        // Resolve input with the stream.
        var resolvedInput = {};

        if (parent.input) {
            resolvedInput = self.resolveArguments(parent.input, flow.currentStream);
        }

        // Create a specific scope for embedded sequence.
        var uniqueScope = self.generateUniqueScope();

        flow.currentStream[uniqueScope] = resolvedInput;

        var currentStream = flow.currentStream[uniqueScope],
            parentStream = flow.currentStream
        ;

        var tributary = flow.addTributary(uniqueScope, null, function() {
                if (parent.output) {
                    // Resolve output with the resulting stream.
                    var resolvedOutput = {};

                    for (var key in parent.output) {
                        var argument = parent.output[key];

                        if ('string' === typeof argument) {
                            argument = self._referenceResolver.resolve(argument, '@', currentStream);
                        }

                        parentStream[key] = argument;
                    }
                }

                delete flow.currentStream[uniqueScope];
            })
        ;

        var task = flow.wait();

        self._sequencesContainer.get(id)(flow, function() {
            flow.end(task);
            callback();
        });

        flow.mergeTributary(tributary);
    };
}
