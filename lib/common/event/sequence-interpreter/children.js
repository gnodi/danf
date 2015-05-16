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
                }
            }

            if (0 === operations.length) {
                interpretation.push({
                    order: order,
                    operations: operations
                });
            }

            operations.push(interpretChild.call(this, child));
        }
    }

    return interpretation;
}

/**
 * Interpret a child
 *
 * @param {object} child The definition of the child.
 * @return {function} The interpreted child.
 */
var interpretChild = function(child) {
    var self = this;

    return function(flow, callback) {
        // Check optional condition.
        if (child.condition) {
            if (!child.condition(flow.stream)) {
                return;
            }
        }

        // Resolve arguments with the stream in the pipe.
        /*var resolvedArguments = [];

        for (var i = 0; i < child.arguments.length; i++) {
            var argument = child.arguments[i];

            if ('string' === typeof argument) {
                argument = self._referenceResolver.resolve(argument, '@', flow.stream);

                if ('string' === typeof argument) {
                    argument = self._referenceResolver.resolve(argument, '$', self._sequencesContainer.config);
                }
            }

            resolvedArguments[i] = argument;
        }*/

        //var tributary = flow.addTributary();

        self._sequencesContainer.get(child.name)(flow, callback);

        //flow.mergeTributary(tributary);
    };
}
