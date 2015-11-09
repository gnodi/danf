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
 */
function CollectionInterpreter() {
}

CollectionInterpreter.defineImplementedInterfaces(['danf:event.collectionInterpreter']);

CollectionInterpreter.defineDependency('_referencesResolver', 'danf:event.referencesResolver');
CollectionInterpreter.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');
CollectionInterpreter.defineDependency('_logger', 'danf:event.logger');
CollectionInterpreter.defineDependency('_asynchronousCollections', 'danf:manipulation.asynchronousCollection_object');

/**
 * References resolver.
 *
 * @var {danf:event.referencesResolver}
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'referencesResolver', {
    set: function(referencesResolver) {
        this._referencesResolver = referencesResolver;
    }
});

/**
 * Flow driver.
 *
 * @var {danf:manipulation.flowDriver}
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'flowDriver', {
    set: function(flowDriver) {
        this._flowDriver = flowDriver;
    }
});

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'logger', {
    set: function(logger) {
        this._logger = logger
    }
});

/**
 * Asynchrounous collections.
 *
 * @var {danf:dependencyInjection.asynchronousCollection_array}
 * @api public
 */
Object.defineProperty(CollectionInterpreter.prototype, 'asynchronousCollections', {
    set: function(asynchronousCollections) {
        this._asynchronousCollections = {};

        for (var i in asynchronousCollections) {
            var asynchronousCollection = asynchronousCollections[i];

            this.setCollectionInterpreter(asynchronousCollection.method, asynchronousCollection, asynchronousCollection.alias);
        }
    }
});

/**
 * Add an asynchrounous collection.
 *
 * @param {string} method The method name.
 * @param {danf:dependencyInjection.asynchronousCollection} asynchronousCollection The asynchronous collection.
 * @param {string|null} alias The optional alias name.
 * @api public
 */
CollectionInterpreter.prototype.setCollectionInterpreter = function(method, asynchronousCollection, alias) {
    this._asynchronousCollections[method] = asynchronousCollection;

    if (undefined === this._asynchronousCollections[alias]) {
        this._asynchronousCollections[alias] = asynchronousCollection;
    }
}

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
CollectionInterpreter.prototype.interpret = function(
    flow,
    callback,
    operation,
    scope,
    tributaryCallback,
    operationArguments,
    retrieveContext,
    executeOperation,
    endOperation
) {
    var self = this,
        collection = operation.collection,
        asynchronousCollection = this._asynchronousCollections[collection.method],
        input = 'object' === typeof collection.input
            ? utils.clone(collection.input)
            : collection.input
    ;

    if (undefined === asynchronousCollection) {
        throw new Error('No asynchronous collection "{0}" found'.format(collection.method));
    }

    if ('string' === typeof input) {
        input = self._referencesResolver.resolveSpecific(input, '@', flow.parentStream);

        input = 'object' === typeof input
            ? utils.clone(input)
            : input
        ;
    }

    var tributary = flow.addTributary(
            scope,
            function(stream) {
                if (
                    null !== stream &&
                    'object' === typeof stream &&
                    Array.isArray(input) &&
                    true !== collection.aggregate
                ) {
                    var formattedData = [];

                    for (var key in stream) {
                        if (key == parseInt(key, 10)) {
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

    var startedAt = new Date(),
        loggingLevel = flow.currentLevel
    ;

    // Log start.
    self._logger.log(
        '<<green>>Collection <<bold>>{0}<</bold>> on <<bold>>{1}<</bold>> start'.format(collection.method, utils.stringify(input)),
        3,
        0,
        tributary,
        loggingLevel,
        startedAt
    );

    args.push(asynchronousCollection.wrapIterator(function(parameters) {
        var value = parameters.item,
            callback = parameters.callback,
            hasKey = parameters.key
        ;

        if ('object' === typeof value && hasKey) {
            value._ = parameters.key;
        }

        self.__asyncFlow = flow;

        flow.setTributary(tributary);

        var resolvedArguments = self._referencesResolver.resolve(operationArguments, retrieveContext());

        // Resolve arguments from the context of the collection.
        for (var name in resolvedArguments) {
            var argument = resolvedArguments[name];

            if (parameters.memo && 'string' === typeof argument) {
                argument = self._referencesResolver.resolveSpecific(argument, '~', parameters.memo);
            }

            if ('string' === typeof argument) {
                argument = self._referencesResolver.resolveSpecific(argument, '@', value);
            }

            resolvedArguments[name] = argument;
        }

        self.__asyncFlow = null;

        // Compute item scope.
        var scope = hasKey ? '.' : null;

        if (true !== collection.aggregate && hasKey) {
            scope = parameters.key;

            if (collection.scope) {
                scope = '{0}.{1}'.format(scope, collection.scope);
            }
        }

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

        // Log end.
        self._logger.log(
            '<<magenta>>Collection <<bold>>{0}<</bold>>{1} end'.format(
                collection.method,
                null != result ? ' with <<bold>>{1}<</bold>>'.format(utils.stringify(result)) : ''
            ),
            3,
            0,
            tributary,
            loggingLevel,
            startedAt
        );

        endOperation(result, task);
    }));

    // Handle collection specific parameters.
    var collectionParameters = {};

    for (var name in asynchronousCollection.parameters) {
        if (null == collection.parameters || undefined === collection.parameters[name]) {
            throw new Error(
                'The parameter "{0}" must be defined for the collection method "{1}".'.format(
                    name,
                    collection.method
                )
            );
        }

        collectionParameters[asynchronousCollection.parameters[name]] = name;
    }

    this.__asyncFlow = flow;

    var resolvedParameters = self._referencesResolver.resolve(collection.parameters, retrieveContext());

    this.__asyncFlow = null;

    for (var i = 0; i < 5; i++) {
        var name = collectionParameters[i];

        if (undefined !== name) {
            args.splice(i, 0, resolvedParameters[name]);
        }
    }

    // Call flow driver method.
    var method = this._flowDriver[asynchronousCollection.method];

    if (undefined === method) {
        throw new Error(
            'Method "{0}" not found (see "https://github.com/caolan/async" for available methods).'.format(
                collection.method
            )
        );
    }

    method.apply(this._flowDriver, args);
}