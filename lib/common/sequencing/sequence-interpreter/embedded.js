'use strict';

/**
 * Expose `Embedded`.
 */
module.exports = Embedded;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new embedded sequence interpreter.
 */
function Embedded() {
    Abstract.call(this);

    Object.hasGetter(this, 'embeddedName');
    Object.hasGetter(this, 'specificContract');
}

utils.extend(Abstract, Embedded);

Embedded.defineAsAbstract();

Embedded.defineDependency('_uniqueIdGenerator', 'danf:manipulation.uniqueIdGenerator');
Embedded.defineDependency('_referencesResolver', 'danf:sequencing.referencesResolver');
Embedded.defineDependency('_collectionInterpreter', 'danf:sequencing.collectionInterpreter');

/**
 * Unique id generator.
 *
 * @var {danf:manipulation.uniqueIdGenerator}
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'uniqueIdGenerator', {
    set: function(uniqueIdGenerator) {
        this._uniqueIdGenerator = uniqueIdGenerator
    }
});

/**
 * References resolver.
 *
 * @var {danf:sequencing.referencesResolver}
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'referencesResolver', {
    set: function(referencesResolver) {
        this._referencesResolver = referencesResolver
    }
});

/**
 * Collection interpreter.
 *
 * @var {danf:sequencing.collectionInterpreter}
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'collectionInterpreter', {
    set: function(collectionInterpreter) {
        this._collectionInterpreter = collectionInterpreter
    }
});

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Object.defineProperty(Embedded.prototype, 'contract', {
    get: function() {
        var contract = {};

        contract[this.embeddedName] = {
            type: 'embedded_array',
            embed: utils.merge(
                {
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
                    input: {
                        type: 'mixed_object',
                        default: {}
                    },
                    output: {
                        type: 'mixed_object',
                        default: {}
                    },
                    catch: {
                        type: 'function'
                    }
                },
                this.specificContract
            )
        };

        return contract;
    }
});

/**
 * Interpret an embedded.
 *
 * @param {object} embedded The definition of the embedded.
 * @param {object} sequenceId The embedded sequence id.
 * @return {function} The interpreted embedded.
 * @api protected
 */
Embedded.prototype.interpretEmbedded = function(embedded, sequenceId) {
    var self = this;

    return function(flow, callback) {
        self.__asyncFlow = flow;

        // Check optional condition.
        if (embedded.condition) {
            if (!embedded.condition(flow.currentStream, utils.clone(flow.context.getAll()))) {
                callback();

                return;
            }
        }

        // Resolve input with the stream.
        var resolvedInput = {},
            collectionStream = utils.clone(flow.currentStream),
            startedAt,
            loggingLevel = 0
        ;

        if (embedded.input) {
            resolvedInput = self._referencesResolver.resolve(
                embedded.input,
                flow.currentStream,
                'the input for the sequence "{0}"'.format(sequenceId)
            );
        }

        // Create a specific scope for embedded sequence.
        var uniqueScope = self._uniqueIdGenerator.generate();

        // Handle case of a collection.
        if (embedded.collection) {
            flow.currentStream[uniqueScope] = collectionStream || {};

            self._collectionInterpreter.interpret(
                flow,
                callback,
                embedded,
                uniqueScope,
                function() {
                    var currentStream = flow.currentStream[uniqueScope];

                    // Handle as normal output.
                    if (embedded.collection.aggregate) {
                        resolveOutput.call(self, embedded, currentStream, flow.currentStream);
                    // Handle specific collection output.
                    } else if (embedded.output) {
                        var output = utils.clone(embedded.output);

                        for (var key in output) {
                            var argument = output[key],
                                resolvedOutput = Array.isArray(currentStream) ? [] : {}
                            ;

                            for (var resolvedKey in currentStream) {
                                var resolvedArgument = argument;

                                resolvedArgument = self._referencesResolver.resolveSpecific(
                                    resolvedArgument,
                                    '@',
                                    currentStream[resolvedKey]
                                );

                                resolvedOutput[resolvedKey] = resolvedArgument;
                            }

                            flow.currentStream[key] = resolvedOutput;
                        }
                    }

                    delete flow.currentStream[uniqueScope];

                    callback();
                },
                embedded.input,
                function() {
                    return flow.currentStream;
                },
                function(asynchronousCollection, resolvedArguments, scope, callback) {
                    self.__asyncFlow = flow;

                    var itemTributary = flow.addTributary(scope, embedded.catch),
                        task = flow.wait()
                    ;

                    flow.currentStream = resolvedArguments;

                    startedAt = new Date();
                    loggingLevel = flow.getTributaryLevel(itemTributary);

                    // Log start.
                    self._logger.log(
                        '<<yellow>>Sequence <<bold>>{0}<</bold>> start'.format(sequenceId),
                        3,
                        0,
                        itemTributary,
                        loggingLevel,
                        startedAt
                    );

                    for (var key in resolvedArguments) {
                        var value = resolvedArguments[key];

                        // Log input.
                        self._logger.log(
                            '<<yellow>>> <<white>>{0}: {1}'.format(
                                key,
                                'object' === typeof value ? utils.stringify(value) : ('string' === typeof value ? '\'{0}\''.format(value) : value)
                            ),
                            3,
                            1,
                            tributary,
                            loggingLevel
                        );
                    }

                    self._sequencesContainer.get(sequenceId).forward(flow, function(error) {
                        flow.end(task, error, function(stream) {
                            resolveOutput.call(self, embedded, stream, stream, tributary, loggingLevel);

                            for (var key in stream) {
                                var value = stream[key];

                                // Log current stream.
                                self._logger.log(
                                    '<<cyan>>{0}: {1}'.format(
                                        key,
                                        'object' === typeof value ? utils.stringify(value) : ('string' === typeof value ? '\'{0}\''.format(value) : value)
                                    ),
                                    3,
                                    1,
                                    tributary,
                                    loggingLevel
                                );
                            }

                            // Log end.
                            self._logger.log(
                                '<<blue>>Sequence <<bold>>{0}<</bold>> end'.format(sequenceId),
                                3,
                                0,
                                tributary,
                                loggingLevel,
                                startedAt
                            );
                        });

                        callback(null);
                    });

                    flow.mergeTributary(itemTributary);
                },
                function(result, task) {
                    flow.end(task);
                }
            );
        // Handle standard case.
        } else {
            flow.currentStream[uniqueScope] = resolvedInput;

            var currentStream = flow.currentStream[uniqueScope],
                tributary = flow.addTributary(uniqueScope, embedded.catch, null, function() {
                    self.__asyncFlow = flow;

                    resolveOutput.call(self, embedded, flow.currentStream[uniqueScope], flow.currentStream, tributary, loggingLevel);

                    delete flow.currentStream[uniqueScope];

                    for (var key in flow.currentStream) {
                        var value = flow.currentStream[key];

                        // Log current stream.
                        self._logger.log(
                            '<<cyan>>{0}: {1}'.format(key, 'object' === typeof value ? utils.stringify(value) : value),
                            3,
                            1,
                            tributary,
                            loggingLevel
                        );
                    }
                    // Log end.
                    self._logger.log(
                        '<<blue>>Sequence <<bold>>{0}<</bold>> end'.format(sequenceId),
                        3,
                        0,
                        tributary,
                        loggingLevel,
                        startedAt
                    );

                    callback();
                }),
                task = flow.wait()
            ;

            startedAt = new Date();
            loggingLevel = flow.getTributaryLevel(tributary);

            // Log start.
            self._logger.log(
                '<<yellow>>Sequence <<bold>>{0}<</bold>> start'.format(sequenceId),
                3,
                0,
                tributary,
                loggingLevel,
                startedAt
            );

            for (var key in resolvedInput) {
                var value = resolvedInput[key];

                // Log input.
                self._logger.log(
                    '<<yellow>>> <<white>>{0}: {1}'.format(
                        key,
                        'object' === typeof value ? utils.stringify(value) : ('string' === typeof value ? '\'{0}\''.format(value) : value)
                    ),
                    3,
                    1,
                    tributary,
                    loggingLevel
                );
            }

            self._sequencesContainer.get(sequenceId).forward(flow, function(error) {
                flow.end(task, error);
            });

            flow.mergeTributary(tributary);
        }

        self.__asyncFlow = null;
    };
}

/**
 * Resolve the output in a context and impact it in the stream.
 *
 * @param {object} embedded The definition of the embedded.
 * @param {object} context The context.
 * @param {object} stream The stream.
 * @param {number} tributary The current tributary identifier.
 * @param {number} loggingLevel The logging level.
 * @api private
 */
var resolveOutput = function(embedded, context, stream, tributary, loggingLevel) {
    if (embedded.output) {
        var output = utils.clone(embedded.output),
            tributaryStream = {}
        ;

        // Resolve output with the stream.
        for (var key in output) {
            var argument = this._referencesResolver.resolveSpecific(
                    output[key],
                    '@',
                    context
                )
            ;

            if (
                argument &&
                tributaryStream[key] &&
                'object' === typeof argument &&
                'object' === typeof tributaryStream[key]
            ) {
                var isArgumentArray = Array.isArray(argument),
                    isStreamKeyArray = Array.isArray(tributaryStream[key])
                ;

                if (isArgumentArray && isStreamKeyArray) {
                    tributaryStream[key] = tributaryStream[key].concat(argument);
                } else if (!isArgumentArray && !isStreamKeyArray) {
                    tributaryStream[key] = utils.merge(
                        tributaryStream[key],
                        argument,
                        true
                    );
                } else {
                    tributaryStream[key] = argument;
                }
            } else {
                tributaryStream[key] = argument;
            }

            // Log output.
            if (undefined !== tributary) {
                this._logger.log(
                    '<<blue>>< <<white>>{0}: {1}'.format(
                        key,
                        'object' === typeof argument ? utils.stringify(argument) : ('string' === typeof argument ? '\'{0}\''.format(argument) : argument)
                    ),
                    3,
                    1,
                    tributary,
                    loggingLevel
                );
            }
        }

        // Impact the main stream with its tributary stream.
        for (var key in tributaryStream) {
            stream[key] = tributaryStream[key];
        }
    }
}