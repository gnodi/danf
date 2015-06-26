'use strict';

/**
 * Expose `CollectionInterpreter`.
 */
module.exports = CollectionInterpreter;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new collection interpreter.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @param {danf:dependencyInjection.registry<danf.manipulation.asynchronousCollection>} asynchronousCollectionsRegistry The registry of asynchronous collections.
 */
function CollectionInterpreter(referenceResolver, flowDriver, asynchronousCollectionsRegistry) {
    if (referenceResolver) {
        this.referenceResolver = referenceResolver;
    }
    if (flowDriver) {
        this.flowDriver = flowDriver;
    }
    if (asynchronousCollectionsRegistry) {
        this.asynchronousCollectionsRegistry = asynchronousCollectionsRegistry;
    }
}

CollectionInterpreter.defineImplementedInterfaces(['danf:event.collectionInterpreter']);

CollectionInterpreter.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
CollectionInterpreter.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');
CollectionInterpreter.defineDependency('_asynchronousCollectionsRegistry', 'danf:manipulation.asynchronousCollectionsRegistry');

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * Set the flow driver.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'flowDriver', {
    set: function(flowDriver) {
        this._flowDriver = flowDriver;
    }
});

/**
 * Set the flow driver.
 *
 * @param {danf:dependencyInjection.registry<danf.manipulation.asynchronousCollection>} asynchronousCollectionsRegistry The registry of asynchronous collections.
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'asynchronousCollectionsRegistry', {
    set: function(asynchronousCollectionsRegistry) {
        this._asynchronousCollectionsRegistry = asynchronousCollectionsRegistry;
    }
});

/**
 * @interface {danf:event.collectionInterpreter}
 */
Object.defineProperty(CollectionInterpreter.prototype, 'contract', {
    value: {
        method: {
            type: 'string',
            default: 'forEachOf'
        },
        input: {
            type: 'string|mixed_array|mixed_object',
            required: true
        },
        parameters: {
            type: 'mixed_object',
            default: {}
        },
        aggregate: {
            type: 'boolean|function',
            default: false
        },
        scope: {
            type: 'string'
        }
    }
});

/**
 * @interface {danf:event.collectionInterpreter}
 */
CollectionInterpreter.prototype.retrieveStreamFormatter = function(operation) {
    var collection = operation.collection,
        asynchronousCollection = this._asynchronousCollectionsRegistry.get(collection.method)
    ;

    return
}

/**
 * @interface {danf:event.collectionInterpreter}
 */
CollectionInterpreter.prototype.interpret = function(
    flow,
    callback,
    operation,
    scope,
    tributaryCallback,
    resolveArguments,
    executeOperation,
    endOperation
) {
    var self = this,
        collection = operation.collection,
        asynchronousCollection = this._asynchronousCollectionsRegistry.get(collection.method),
        input = utils.clone(collection.input)
    ;

    if ('string' === typeof input) {
        input = self._referenceResolver.resolve(input, '@', flow.parentStream);
    }

    var tributary = flow.addTributary(
            scope,
            function(stream) {
                if (
                    'object' === typeof stream &&
                    Array.isArray(input) &&
                    true !== collection.aggregate
                ) {
                    var formattedData = [];

                    for (var key in stream) {
                        if (undefined !== input[key]) {
                            formattedData.push(stream[key]);
                        }
                    }

                    stream = formattedData;
                }

                if ('function' === typeof collection.aggregate) {
                    stream = collection.aggregate(stream);
                }

                if (collection.scope) {
                    stream = utils.merge(input, stream, true);

                    for (var key in stream) {
                        delete stream[key]._;
                    }
                }

                return stream;
            },
            tributaryCallback
        ),
        task = flow.wait(),
        args = [asynchronousCollection.formatInput(input)]
    ;

    args.push(asynchronousCollection.wrapIterator(function(parameters) {
        var value = parameters.item,
            callback = parameters.callback,
            hasKey = parameters.key
        ;

        if (hasKey) {
            value._ = parameters.key;
        }

        var resolvedArguments = resolveArguments();

        // Resolve arguments from the context of the collection.
        for (var name in resolvedArguments) {
            var argument = resolvedArguments[name];

            if ('string' === typeof argument) {
                argument = self._referenceResolver.resolve(argument, '@', value);
            }

            resolvedArguments[name] = argument;
        }

        // Compute item scope.
        var scope = hasKey ? '.' : null;

        if (true !== collection.aggregate && hasKey) {
            scope = parameters.key;

            if (collection.scope) {
                scope = '{0}.{1}'.format(scope, collection.scope);
            }
        }

        flow.setTributary(tributary);

        executeOperation(asynchronousCollection, resolvedArguments, scope, callback);

        flow.mergeTributary(tributary);
    }));
    args.push(asynchronousCollection.wrapCallback(function(result) {
        if (undefined !== result) {
            var isCurrentTributary = flow.currentTributary === tributary;

            if (!isCurrentTributary) {
                flow.setTributary(tributary);
            }

            flow.currentStream = result;

            if (!isCurrentTributary) {
                flow.mergeTributary(tributary);
            }
        }

        endOperation(result, task);
    }));

    // Handle collection specific parameters.
    var collectionParameters = {};

    for (var name in asynchronousCollection.parameters) {
        if (undefined === collection.parameters[name]) {
            throw new Error(
                'The parameter "{0}" must be defined for the collection method "{1}".'.format(
                    name,
                    collection.method
                )
            );
        }

        collectionParameters[asynchronousCollection.parameters[name]] = name;
    }

    for (var i = 0; i < 5; i++) {
        var name = collectionParameters[i];

        if (undefined !== name) {
            args.splice(i, 0, collection.parameters[name])
        }
    }

    // Call flow driver method.
    var method = this._flowDriver[collection.method];

    if (undefined === method) {
        throw new Error(
            'Method "{0}" not found (see "https://github.com/caolan/async" for available methods).'.format(
                collection.method
            )
        );
    }

    method.apply(this._flowDriver, args);
}