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
 * Initialize a new operations sequence interpreter.
 *
 * @param {danf:dependencyInjection.sequencesContainer} sequencesContainer The sequences container.
 * @param {danf:event.referencesResolver} referencesResolver The references resolver.
 * @param {danf:manipulation.servicesContainer} servicesContainer The services container.
 * @param {danf:event.collectionInterpreter} collectionInterpreter The collection interpreter.
 */
function Operations(sequencesContainer, referencesResolver, servicesContainer, collectionInterpreter) {
    Abstract.call(this, sequencesContainer);

    this._order = 1000;
    if (referencesResolver) {
        this.referencesResolver = referencesResolver;
    }
    if (servicesContainer) {
        this.servicesContainer = servicesContainer;
    }
    if (collectionInterpreter) {
        this.collectionInterpreter = collectionInterpreter;
    }
}

utils.extend(Abstract, Operations);

Operations.defineDependency('_referencesResolver', 'danf:event.referencesResolver');
Operations.defineDependency('_servicesContainer', 'danf:dependencyInjection.servicesContainer');
Operations.defineDependency('_collectionInterpreter', 'danf:event.collectionInterpreter');

/**
 * Set the references resolver.
 *
 * @param {danf:event.referencesResolver} The references resolver.
 * @api public
 */
Object.defineProperty(Operations.prototype, 'referencesResolver', {
    set: function(referencesResolver) {
        this._referencesResolver = referencesResolver
    }
});

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
 * Set the collection interpreter.
 *
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 * @api public
 */
Object.defineProperty(Operations.prototype, 'collectionInterpreter', {
    set: function(collectionInterpreter) {
        this._collectionInterpreter = collectionInterpreter
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Operations.prototype, 'contract', {
    get: function() {
        return {
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
                    collection: {
                        type: 'embedded',
                        embed: this._collectionInterpreter.contract
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
                    scope: {
                        type: 'string'
                    }
                }
            }
        }
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Operations.prototype.interpret = function(interpretation, definition, context) {
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

                if (
                    (minOrder === previousOrder || minOrder > order) &&
                    (null == previousOrder || previousOrder < order)
                ) {
                    minOrder = order;
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
            if (!operation.condition(flow.currentStream)) {
                return;
            }
        }

        // Handle case of a collection.
        if (operation.collection) {
            self._collectionInterpreter.interpret(
                flow,
                callback,
                operation,
                operation.scope,
                null,
                operation.arguments,
                function() {
                    return flow.parentStream;
                },
                function(asynchronousCollection, resolvedArguments, scope, callback) {
                    service.__asyncFlow = flow;

                    // Call the target handler.
                    service[operation.method].__asyncApply(
                        service,
                        scope,
                        resolvedArguments,
                        null,
                        function(stream) {
                            asynchronousCollection.executeIteratorCallback(
                                callback,
                                null,
                                stream
                            );
                        }
                    );

                    service.__asyncFlow = null;
                },
                function(result, task) {
                    callback(result);
                    flow.end(task);
                }
            );
        // Handle standard case.
        } else {
            var resolvedArguments = self._referencesResolver.resolve(operation.arguments, flow.currentStream);

            service.__asyncFlow = flow;

            // Call the target handler.
            service[operation.method].__asyncApply(
                service,
                operation.scope || '.',
                resolvedArguments,
                null,
                function() {
                    callback(null);
                }
            );

            service.__asyncFlow = null;
        }
    };
}
