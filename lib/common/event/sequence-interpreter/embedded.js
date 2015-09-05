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
 *
 * @param {danf:event.sequencesContainer} The sequences container.
 * @param {danf:event.referencesResolver} The references resolver.
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 */
function Embedded(sequencesContainer, referencesResolver, collectionInterpreter) {
    Abstract.call(this, sequencesContainer);

    if (referencesResolver) {
        this.referencesResolver = referencesResolver;
    }
    if (collectionInterpreter) {
        this.collectionInterpreter = collectionInterpreter;
    }

    Object.hasGetter(this, 'embeddedName');
    Object.hasGetter(this, 'specificContract');
}

utils.extend(Abstract, Embedded);

Embedded.defineAsAbstract();

Embedded.defineDependency('_uniqueIdGenerator', 'danf:manipulation.uniqueIdGenerator');
Embedded.defineDependency('_referencesResolver', 'danf:event.referencesResolver');
Embedded.defineDependency('_collectionInterpreter', 'danf:event.collectionInterpreter');

/**
 * Set the unique id generator.
 *
 * @param {danf:manipulation.uniqueIdGenerator} The unique id generator.
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'uniqueIdGenerator', {
    set: function(uniqueIdGenerator) {
        this._uniqueIdGenerator = uniqueIdGenerator
    }
});

/**
 * Set the references resolver.
 *
 * @param {danf:event.referencesResolver} The references resolver.
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'referencesResolver', {
    set: function(referencesResolver) {
        this._referencesResolver = referencesResolver
    }
});

/**
 * Set the collection interpreter.
 *
 * @param {danf:event.collectionInterpreter} The collection interpreter.
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'collectionInterpreter', {
    set: function(collectionInterpreter) {
        this._collectionInterpreter = collectionInterpreter
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
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
            if (!embedded.condition(flow.currentStream)) {
                return;
            }
        }

        // Resolve input with the stream.
        var resolvedInput = {},
            collectionStream = utils.clone(flow.currentStream)
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
                    if (embedded.output) {
                        var currentStream = flow.currentStream[uniqueScope];

                        // Resolve output with the resulting stream.
                        for (var key in embedded.output) {
                            var argument = embedded.output[key];

                            if (embedded.collection.aggregate) {
                                if ('string' === typeof argument) {
                                    argument = self._referencesResolver.resolveSpecific(argument, '@', currentStream);
                                }

                                flow.currentStream[key] = argument;
                            } else {
                                var resolvedOutput = Array.isArray(currentStream) ? [] : {};

                                for (var resolvedKey in currentStream) {
                                    var resolvedArgument = argument;

                                    if ('string' === typeof resolvedArgument) {
                                        resolvedArgument = self._referencesResolver.resolveSpecific(
                                            resolvedArgument,
                                            '@',
                                            currentStream[resolvedKey]
                                        );
                                    }

                                    resolvedOutput[resolvedKey] = resolvedArgument;
                                }

                                flow.currentStream[key] = resolvedOutput;
                            }
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
                    var itemTributary = flow.addTributary(scope),
                        task = flow.wait()
                    ;

                    flow.currentStream = resolvedArguments;

                    // Log execution
                    self._logger.log(
                        'Sequence <<bold>>{0} on collection'.format(sequenceId),
                        2,
                        0,
                        itemTributary
                    );

                    self._sequencesContainer.get(sequenceId).forward(flow, function() {
                        flow.end(task, function(stream) {
                            if (embedded.output) {
                                // Resolve output with the resulting stream.
                                for (var key in embedded.output) {
                                    var argument = embedded.output[key];

                                    if ('string' === typeof argument) {
                                        argument = self._referencesResolver.resolveSpecific(argument, '@', stream);
                                    }

                                    stream[key] = argument;
                                }
                            }
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
                tributary = flow.addTributary(uniqueScope, null, function() {
                    if (embedded.output) {
                        // Resolve output with the resulting stream.
                        for (var key in embedded.output) {
                            var argument = embedded.output[key];

                            if ('string' === typeof argument) {
                                argument = self._referencesResolver.resolveSpecific(argument, '@', currentStream);
                            }

                            flow.currentStream[key] = argument;

                            // Log output
                            self._logger.log(
                                '<<grey>>< {0}: {1}'.format(key, 'object' === typeof argument ? JSON.stringify(argument) : argument),
                                2,
                                1,
                                tributary
                            );
                        }
                    }

                    delete flow.currentStream[uniqueScope];

                    callback();
                }),
                task = flow.wait()
            ;

            // Log execution
            self._logger.log(
                'Sequence <<bold>>{0}'.format(sequenceId),
                2,
                0,
                tributary
            );

            for (var key in resolvedInput) {
                var value = resolvedInput[key];

                // Log input
                self._logger.log(
                    '<<grey>>> {0}: {1}'.format(key, 'object' === typeof value ? JSON.stringify(value) : value),
                    2,
                    1,
                    tributary
                );
            }

            self._sequencesContainer.get(sequenceId).forward(flow, function() {
                flow.end(task);
            });

            flow.mergeTributary(tributary);
        }

        self.__asyncFlow = null;
    };
}