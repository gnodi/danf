'use strict';

/**
 * Expose `Children`.
 */
module.exports = Children;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new children sequence builder.
 *
 * @param {danf:dependencyInjection.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Children(sequencesContainer, referenceResolver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._order = 1200;
}

utils.extend(Abstract, Children);

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Children.prototype, 'contract', {
    value: {
        children: {
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
Children.prototype.interpret = function(interpretation, definition) {
    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var operations = [],
                child = definition.children[i],
                order = child.order
            ;

            for (var j = 0; j < interpretation.length; j++) {
                if (interpretation[j].order === order) {
                    operations = interpretation[j].operations;
                    break;
                } else if (interpretation[j].order > order) {
                    break;
                }
            }

            if (0 === operations.length) {
                if (j === operations.length - 1) {
                    interpretation.push(
                        {
                            order: order,
                            operations: operations
                        }
                    );
                } else {
                    interpretation.splice(
                        j,
                        0,
                        {
                            order: order,
                            operations: operations
                        }
                    );
                }
            }

            operations.push(interpretChild.call(this, child));
        }
    }

    return interpretation;
}

/**
 * Interpret a child.
 *
 * @param {object} child The definition of the child.
 * @return {function} The interpreted child.
 */
var interpretChild = function(child) {
    var self = this;

    return function(flow, callback) {
        // Check optional condition.
        if (child.condition) {
            if (!child.condition(flow.currentStream)) {
                return;
            }
        }

        // Resolve input with the stream.
        var resolvedInput = {};

        if (child.input) {
            for (var key in child.input) {
                var argument = child.input[key];

                if ('string' === typeof argument) {
                    argument = self._referenceResolver.resolve(argument, '@', flow.currentStream);

                    if ('string' === typeof argument) {
                        argument = self._referenceResolver.resolve(argument, '$', self._sequencesContainer.config);
                    }
                }

                resolvedInput[key] = argument;
            }
        }

        // Create a specific scope for embedded sequence.
        var uniqueScope = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            })
        ;

        flow.currentStream[uniqueScope] = resolvedInput;

        var currentStream = flow.currentStream[uniqueScope],
            parentStream = flow.currentStream
        ;

        var tributary = flow.addTributary(uniqueScope, function() {
                if (child.output) {
                    // Resolve output with the resulting stream.
                    var resolvedOutput = {};

                    for (var key in child.output) {
                        var argument = child.output[key];

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

        self._sequencesContainer.get(child.name)(flow, function() {
            flow.end(task);
            callback();
        });

        flow.mergeTributary(tributary);
    };
}
