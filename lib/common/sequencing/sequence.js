'use strict';

/**
 * Expose `Sequence`.
 */
module.exports = Sequence;

/**
 * Static variable allowing to handle the asynchronous flow.
 *
 * @var {object}
 */
var __async = {};

/**
 * Call an async method.
 *
 * @param {object} target The async object.
 * @param {string|null} scope The scope.
 * @param {mixed...} arg1...N The arguments to pass to the method.
 */
if (!Function.prototype.__asyncCall) {
    Function.prototype.__asyncCall = function(target, scope) {
        var args = Array.prototype.slice.call(arguments, 2),
            self = this,
            flow = __async.flow,
            tributary = flow.addTributary(scope),
            result
        ;

        target.__asyncProcess(function(async) {
            result = self.apply(target, args);

            if (undefined !== result) {
                return result;
            } else {
                return function(stream) {
                    return stream;
                };
            }
        });

        flow.mergeTributary(tributary);

        return result;
    };
}

/**
 * Call an async method.
 *
 * @param {object} target The async object.
 * @param {string|null} scope The scope.
 * @param {mixed_array} arg1...N The arguments to pass to the method.
 * @param {function|null} catch An optional function to catch errors.
 * @param {function|null} format An optional function to format resulting stream.
 * @param {function|null} callback An optional callback.
 */
if (!Function.prototype.__asyncApply) {
    Function.prototype.__asyncApply = function(target, scope, args, catch_, format, callback) {
        var self = this,
            flow = __async.flow,
            tributary = flow.addTributary(scope, catch_, format, callback),
            result
        ;

        target.__asyncProcess(function(async) {
            result = self.apply(target, args);

            if (undefined !== result) {
                return result;
            } else {
                return function(stream) {
                    return stream;
                };
            }
        });

        flow.mergeTributary(tributary);

        return result;
    };
}

/**
 * Get/set the current async flow.
 *
 * @param {object} asyncFlow The current async flow.
 * @api public
 */
if (!Object.getOwnPropertyDescriptor(Object.prototype, '__asyncFlow')) {
    Object.defineProperty(Object.prototype, '__asyncFlow', {
        get: function() { return __async.flow; },
        set: function(asyncFlow) {
            // Handle strange behavior of Object.getOwnPropertyNames().
            if (asyncFlow === true) {
                return;
            }

            __async.flow = asyncFlow;
        }
    });
}

/**
 * Process an async task.
 *
 * @param {function} callback The task callback.
 * @api public
 */
if (!Object.getOwnPropertyDescriptor(Object.prototype, '__asyncProcess')) {
    Object.defineProperty(Object.prototype, '__asyncProcess', {
        value: function(callback) {
            var flow = __async.flow,
                task = flow.wait(),
                returned,
                errored = false,
                asyncWrapper = function(callback) {
                    if (undefined !== returned) {
                        throw new Error('Cannot have a synchronous and an asynchronous return.');
                    }

                    var self = this;

                    return function() {
                        if (callback) {
                            var errored = false,
                                args = Array.prototype.slice.call(arguments)
                            ;

                            try {
                                var originFlow = __async.flow;

                                __async.flow = flow;

                                returned = callback.apply(self, args);

                                __async.flow = originFlow;
                            } catch (error) {
                                flow.end(task, error);
                                errored = true;
                            }

                            // Handle normal end out of the try to avoid error chaining.
                            if (!errored) {
                                flow.end(task, null, returned);
                            }
                        } else {
                            flow.end(task);
                        }
                    }
                }
            ;

            try {
                returned = callback.call(this, asyncWrapper.bind(this));
            } catch (error) {
                errored = true;
                flow.end(task, error);
            }

            // Handle case of a synchronous use of __asyncProcess.
            // (adding a scope for exemple)
            if (!errored && undefined !== returned) {
                flow.end(task, null, returned);
            }
        }
    });
}

/**
 * Initialize a new sequence.
 */
function Sequence() {
}

Sequence.defineImplementedInterfaces(['danf:sequencing.sequence']);

Sequence.defineDependency('_operation', 'function');
Sequence.defineDependency('_flowProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.flow');
Sequence.defineDependency('_mapProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.map');
Sequence.defineDependency('_uniqueIdGenerator', 'danf:manipulation.uniqueIdGenerator');

/**
 * Main operation of the sequence.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'operation', {
    set: function(operation) { this._operation = operation; }
});

/**
 * Flow provider.
 *
 * @var {danf:manipulation.provider<danf:manipulation.flow>}
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'flowProvider', {
    set: function(flowProvider) { this._flowProvider = flowProvider; }
});

/**
 * Map provider.
 *
 * @var {danf:manipulation.provider<danf:manipulation.map>}
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'mapProvider', {
    set: function(mapProvider) { this._mapProvider = mapProvider; }
});

/**
 * Unique id generator.
 *
 * @var {danf:manipulation.uniqueIdGenerator}
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'uniqueIdGenerator', {
    set: function(uniqueIdGenerator) {
        this._uniqueIdGenerator = uniqueIdGenerator
    }
});

/**
 * @interface {danf:sequencing.sequence}
 */
Sequence.prototype.execute = function(input, context, scope, catch_, callback) {
    var contextMap = this._mapProvider.provide({name: 'flow'});

    for (var key in context) {
        contextMap.set(key, context[key]);
    }

    var flow = this._flowProvider.provide({
            id: this._uniqueIdGenerator.generate(),
            stream: input,
            initialScope: scope,
            globalCatch: catch_,
            context: contextMap,
            callback: callback
        })
    ;

    return this._operation(flow);
}

/**
 * @interface {danf:sequencing.sequence}
 */
Sequence.prototype.forward = function(flow, callback) {
    return this._operation(flow, callback);
}