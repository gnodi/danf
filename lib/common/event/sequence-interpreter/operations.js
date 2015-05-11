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
 * @param {danf:manipulation.servicesContainer} The services container.
 */
function Operations(sequencesContainer, referenceResolver, servicesContainer) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    this._order = 1000;
    if (servicesContainer) {
        this.servicesContainer = servicesContainer;
    }
}

utils.extend(Abstract, Operations);

/**
 * Set the services container.
 *
 * @param {danf:dependencyInjection.servicesContainer} The services container.
 * @api public
 */
Object.defineProperty(Operations.prototype, 'servicesContainer', {
    set: function(servicesContainer) {
        this._servicesContainer = servicesContainer
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
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
 * @interface {danf:event.sequenceInterpreter}
 */
Operations.prototype.interpret = function(interpretation, definition) {
    if (definition.operations) {
        var orders = [],
            minOrder,
            previousOrder,
            hasOtherOperations = true
        ;

        // Build an ordered array of orders.
        while (hasOtherOperations) {
            hasOtherOperations = false;

            for (var i = 0; i < definition.operations.length; i++) {
                var order = definition.operations[i].order;

                if (null == minOrder) {
                    minOrder = order;
                    hasOtherOperations = true;
                }

                if (minOrder > order && (null == previousOrder || previousOrder < order)) {
                    minOrder = operation.order;
                    hasOtherOperations = true;
                }
            }

            if (hasOtherOperations) {
                orders.push(minOrder);
                previousOrder = minOrder;
            }
        }

        for (var i = 0; i < orders.length; i++) {
            var order = orders[i],
                operations = []
            ;

            for (var j = 0; j < definition.operations.length; j++) {
                var operation = definition.operations[j];

                if (operation.order === order) {
                    operations.push(interpretOperation.call(this, operation));
                }
            }

            interpretation.push({
                order: order,
                operations: operations
            });
        }
    }

    return interpretation;
}

/**
 * Interpret an operation
 *
 * @param {object} operation The definition of the operation.
 * @return {function} The interpreted operation.
 */
var interpretOperation = function(operation) {
    var service = this._servicesContainer.get(operation.service);

    if (null == service) {
        throw new Error(
            'The service "{0}" is not defined.'.format(
                operation.service
            )
        );
    }

    if ('function' !== typeof service[operation.method]) {
        throw new Error(
            'The service "{0}" has no method "{1}".'.format(
                operation.service,
                operation.method
            )
        );
    }

    var self = this;

    return function(flow, callback) {
        // Check optional condition.
        if (operation.condition) {
            if (!operation.condition(flow.stream)) {
                return;
            }
        }

        // Resolve arguments with the stream in the pipe.
        var resolvedArguments = [];

        for (var i = 0; i < operation.arguments.length; i++) {
            var argument = operation.arguments[i];

            if ('string' === typeof argument) {
                argument = self._referenceResolver.resolve(argument, '@', flow.stream);

                if ('string' === typeof argument) {
                    argument = self._referenceResolver.resolve(argument, '$', self._sequencesContainer.config);
                }
            }

            resolvedArguments[i] = argument;
        }

        service.__asyncFlow = flow;

        // Call the target handler.
        service[operation.method].__asyncApply(
            service,
            operation.scope,
            resolvedArguments
        );

        service.__asyncFlow = null;
    };
}
