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
 * @param {danf:manipulation.flowDriver} The flow driver.
 */
function Children(sequencesContainer, referenceResolver, flowDriver) {
    Abstract.call(this, sequencesContainer, referenceResolver, flowDriver);

    this._order = 1200;
    if (flowDriver) {
        this.flowDriver = flowDriver;
    }
}

utils.extend(Abstract, Children);

/**
 * Set the flow driver.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(Children.prototype, 'flowDriver', {
    set: function(flowDriver) { this._flowDriver = flowDriver; }
});

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
            resolvedInput = self.resolveArguments(child.input, flow.currentStream);
        }

        // Create a specific scope for embedded sequence.
        var uniqueScope = self.generateUniqueScope();

        // Handle case of a collection.
        if (child.collection) {
            var collection = child.collection;

            flow.currentStream[uniqueScope] = {};

            var currentStream = flow.currentStream[uniqueScope],
                parentStream = flow.parentStream
            ;

            for (var i in collection.input) {
                currentStream[i] = resolvedInput;
            }

            var args = [utils.clone(collection.input)],
                collectionTributary = flow.addTributary(
                    uniqueScope,
                    function(stream) {
                        if (Array.isArray(collection.input) && true !== collection.aggregate) {
                            var formattedStream = [];

                            for (var i in stream) {
                                formattedStream[i] = stream[i];
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
                        if (child.output) {
                            var currentStream = flow.currentStream[uniqueScope];

                            // Resolve output with the resulting stream.
                            for (var key in child.output) {
                                var argument = child.output[key];

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
                        child.input,
                        flow.currentTributary === collectionTributary ? parentStream : flow.currentStream
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
                var scope;

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

                self._sequencesContainer.get(child.name)(flow, function() {
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
                    if (child.output) {
                        // Resolve output with the resulting stream.
                        for (var key in child.output) {
                            var argument = child.output[key];

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

            self._sequencesContainer.get(child.name)(flow, function() {
                flow.end(task);
            });

            flow.mergeTributary(tributary);
        }
    };
}
