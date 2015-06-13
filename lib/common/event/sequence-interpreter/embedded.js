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
 * Initialize a new Embedded sequence builder.
 *
 * @param {danf:event.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @param {danf:manipulation.flowDriver} The flow driver.
 * @api private
 */
function Embedded(sequencesContainer, referenceResolver, flowDriver) {
    Abstract.call(this, sequencesContainer, referenceResolver);

    if (flowDriver) {
        this.flowDriver = flowDriver;
    }

    Object.hasGetter(this, 'embeddedName');
}

utils.extend(Abstract, Embedded);

Embedded.defineAsAbstract();

/**
 * Set the flow driver.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(Embedded.prototype, 'flowDriver', {
    set: function(flowDriver) { this._flowDriver = flowDriver; }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Embedded.prototype, 'contract', {
    get: function() {
        var contract = {};

        contract[this.embeddedName] = {
            type: 'embedded_array',
            embed: {
                condition: {
                    type: 'function'
                },
                order: {
                    type: 'number',
                    default: 0
                },
                collection: this._collectionContract,
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

        return contract;
    }
});

/**
 * Generate a unique scope.
 *
 * @return {string} The unique scope.
 * @api protected
 */
Embedded.prototype.generateUniqueScope = function() {
    // Create a specific scope for embedded sequence.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

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
            resolvedInput = self.resolveArguments(embedded.input, flow.currentStream);
        }

        // Create a specific scope for embedded sequence.
        var uniqueScope = self.generateUniqueScope();

        // Handle case of a collection.
        if (embedded.collection) {
            var collection = embedded.collection;

            flow.currentStream[uniqueScope] = collectionStream || {};

            var parentStream = flow.parentStream,
                args = [utils.clone(collection.input)],
                collectionTributary = flow.addTributary(
                    uniqueScope,
                    function(stream) {
                        if (Array.isArray(collection.input) && true !== collection.aggregate) {
                            var formattedStream = [];

                            for (var i in stream) {
                                if (i in collection.input) {
                                    formattedStream[i] = stream[i];
                                }
                            }

                            stream = formattedStream;
                        }

                        if ('function' === typeof collection.aggregate) {
                            stream = collection.aggregate(stream);
                        }

                        if (collection.scope) {
                            stream = utils.merge(collection.input, stream, true);
                        }

                        return stream;
                    },
                    function() {
                        if (embedded.output) {
                            var currentStream = flow.currentStream[uniqueScope];

                            // Resolve output with the resulting stream.
                            for (var key in embedded.output) {
                                var argument = embedded.output[key];

                                if (collection.aggregate) {
                                    if ('string' === typeof argument) {
                                        argument = self._referenceResolver.resolve(argument, '@', currentStream);
                                    }

                                    flow.currentStream[key] = argument;
                                } else {
                                    var resolvedOutput = Array.isArray(currentStream) ? [] : {};

                                    for (var resolvedKey in currentStream) {
                                        var resolvedArgument = argument;

                                        if ('string' === typeof resolvedArgument) {
                                            resolvedArgument = self._referenceResolver.resolve(
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
                    }
                ),
                task = flow.wait()
            ;

            args = args.concat(collection.arguments || []);
            args.push(function(value, key, callback) {
                var hasKey = 'function' !== typeof key;

                if (hasKey) {
                    value._ = key;
                } else {
                    callback = key;
                }

                var resolvedArguments = self.resolveArguments(
                        embedded.input,
                        flow.currentStream
                    )
                ;

                // Resolve arguments from the context of the collection.
                for (var name in resolvedArguments) {
                    var argument = resolvedArguments[name];

                    if ('string' === typeof argument) {
                        argument = self._referenceResolver.resolve(argument, '@', value);
                    }

                    resolvedArguments[name] = argument;
                }

                // Compute item scope.
                var scope = '.';

                if (true !== collection.aggregate && hasKey) {
                    scope = key;

                    if (collection.scope) {
                        scope = '{0}.{1}'.format(scope, collection.scope);
                    }
                }

                flow.setTributary(collectionTributary);

                var itemTributary = flow.addTributary(scope),
                    task = flow.wait()
                ;

                flow.currentStream = resolvedArguments;

                self._sequencesContainer.get(sequenceId)(flow, function() {
                    callback(null);
                    flow.end(task);
                });

                flow.mergeTributary(itemTributary);
                flow.mergeTributary(collectionTributary);
            });
            args.push(function(err) {
                if (err) {
                    throw err;
                }

                flow.end(task);
            });

            var method = self._flowDriver[collection.method];

            if (undefined === method) {
                throw new Error(
                    'Method "{0}" not found (see "https://github.com/caolan/async" for available methods).'.format(
                        collection.method
                    )
                );
            }

            method.apply(self._flowDriver, args);
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
                                argument = self._referenceResolver.resolve(argument, '@', currentStream);
                            }

                            flow.currentStream[key] = argument;
                        }
                    }

                    delete flow.currentStream[uniqueScope];

                    callback();
                }),
                task = flow.wait()
            ;

            self._sequencesContainer.get(sequenceId)(flow, function() {
                flow.end(task);
            });

            flow.mergeTributary(tributary);
        }
    };
}