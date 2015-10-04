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
 */
function Operations() {
    Abstract.call(this);

    this._order = 1000;
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
                        namespace: true
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
                var order = definition.operations[i].order || 0;

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

    if ('.' !== operation.method && 'function' !== typeof service[operation.method]) {
        throw new Error(
            'The service "{0}" has no method "{1}".'.format(
                operation.service,
                operation.method
            )
        );
    } else if ('.' === operation.method && 'function' !== typeof service) {
        throw new Error(
            'The service "{0}" is not a function service.'.format(
                operation.service
            )
        );
    }

    var self = this;

    return function(flow, callback) {
        self.__asyncFlow = flow;

        var startedAt,
            loggingLevel = 0,
            tributary = flow.currentTributary
        ;

        // Check optional condition.
        if (operation.condition) {
            if (!operation.condition(flow.currentStream, utils.clone(flow.context.getAll()))) {
                callback();

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
                    self.__asyncFlow = flow;

                    var tributary = flow.tributaryCount,
                        startedAt = new Date()
                    ;

                    // Log start.
                    self._logger.log(
                        'Service <<bold>>{0}<</bold>> method <<bold>>{1}<</bold>> start'.format(operation.service, operation.method),
                        3,
                        2,
                        tributary,
                        loggingLevel,
                        startedAt
                    );

                    for (var i = 0; i < resolvedArguments.length; i++) {
                        var value = resolvedArguments[i];

                        // Log input.
                        self._logger.log(
                            '> <<white>>{0}: {1}'.format(i, 'object' === typeof value ? JSON.stringify(value) : value),
                            3,
                            3,
                            tributary,
                            loggingLevel
                        );
                    }

                    // Call the target handler.
                    var method = '.' !== operation.method
                            ? service[operation.method]
                            : service
                    ;

                    method.__asyncApply(
                        service,
                        scope,
                        resolvedArguments,
                        null,
                        function(stream) {
                            self.__asyncFlow = flow;

                            if (null != scope) {
                                // Log output.
                                self._logger.log(
                                    '<<grey>>< <<white>>{0}: {1}'.format(operation.scope, 'object' === typeof stream ? JSON.stringify(stream) : stream),
                                    3,
                                    3,
                                    tributary,
                                    loggingLevel
                                );
                            }

                            // Log end.
                            self._logger.log(
                                '<<grey>>Service <<bold>>{0}<</bold>> method <<bold>>{1}<</bold>> end'.format(operation.service, operation.method),
                                3,
                                2,
                                tributary,
                                loggingLevel,
                                startedAt
                            );

                            asynchronousCollection.executeIteratorCallback(
                                callback,
                                null,
                                stream
                            );
                        }
                    );

                    self.__asyncFlow = null;
                },
                function(result, task) {
                    callback(result);
                    flow.end(task);
                }
            );
        // Handle standard case.
        } else {
            var tributary = flow.tributaryCount;

            startedAt = new Date();
            loggingLevel = flow.currentLevel + 1;

            // Log start.
            self._logger.log(
                'Service <<bold>>{0}<</bold>> method <<bold>>{1}<</bold>> start'.format(operation.service, operation.method),
                3,
                0,
                tributary,
                loggingLevel,
                startedAt
            );

            var resolvedArguments = self._referencesResolver.resolve(operation.arguments, flow.currentStream);

            for (var i = 0; i < resolvedArguments.length; i++) {
                var value = resolvedArguments[i];

                // Log input.
                self._logger.log(
                    '> <<white>>{0}: {1}'.format(i, 'object' === typeof value ? JSON.stringify(value) : value),
                    3,
                    1,
                    tributary,
                    loggingLevel
                );
            }

            // Call the target handler.
            var scope = operation.scope || '.',
                method = '.' !== operation.method
                    ? service[operation.method]
                    : service
            ;

            method.__asyncApply(
                service,
                scope,
                resolvedArguments,
                null,
                function(stream) {
                    self.__asyncFlow = flow;

                    if (null != scope) {
                        // Log output.
                        self._logger.log(
                            '<<grey>>< <<white>>{0}: {1}'.format(scope, 'object' === typeof stream ? JSON.stringify(stream) : stream),
                            3,
                            1,
                            tributary,
                            loggingLevel
                        );
                    }

                    // Log end.
                    self._logger.log(
                        '<<grey>>Service <<bold>>{0}<</bold>> method <<bold>>{1}<</bold>> end'.format(operation.service, operation.method),
                        3,
                        0,
                        tributary,
                        loggingLevel,
                        startedAt
                    );

                    callback(null);
                }
            );
        }

        self.__asyncFlow = null;
    };
}
