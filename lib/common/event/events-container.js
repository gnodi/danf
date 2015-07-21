'use strict';

/**
 * Expose `EventsContainer`.
 */
module.exports = EventsContainer;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new events container.
 *
 * @param {danf:manipulation.flowDriver} The flow driver.
 * @param {danf:dependencyInjection.provider<danf:manipulation:event>} eventProvider The event provider.
 */
function EventsContainer(flowDriver, eventProvider) {
    this._definitions = {};
    this._context = {};
    this._eventInterpreters = [];
    this._handledParameters = {};

    if (flowDriver) {
        this.flowDriver = flowDriver;
    }
    if (eventProvider) {
        this.eventProvider = eventProvider;
    }

    resetEvents.call(this);
}

EventsContainer.defineImplementedInterfaces(['danf:event.eventsContainer', 'danf:manipulation.registryObserver']);

EventsContainer.defineDependency('_eventInterpreters', 'danf:event.eventInterpreter_array');
EventsContainer.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');
EventsContainer.defineDependency('_eventProvider', 'danf:dependencyInjection.provider', 'danf:event.event');

/**
 * Set the flow driver.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(EventsContainer.prototype, 'flowDriver', {
    set: function(flowDriver) { this._flowDriver = flowDriver; }
});

/**
 * Set the event provider.
 *
 * @param {danf:dependencyInjection.provider<danf:manipulation:event>} The event provider.
 * @api public
 */
Object.defineProperty(EventsContainer.prototype, 'eventProvider', {
    set: function(eventProvider) { this._eventProvider = eventProvider; }
});

/**
 * @interface {danf:event.eventsContainer}
 */
Object.defineProperty(EventsContainer.prototype, 'handledParameters', {
    get: function() { return this._handledParameters }
});

/**
 * Add a event interpreter.
 *
 * @param {danf:event.eventInterpreter} eventInterpreter The event interpreter.
 * @api public
 */
EventsContainer.prototype.addEventInterpreter = function(eventInterpreter) {
    Object.checkType(eventInterpreter, 'danf:event.eventInterpreter');

    var added = false,
        order = eventInterpreter.order
    ;

    // Register handled parameters.
    this._handledParameters = utils.merge(this._handledParameters, eventInterpreter.contract);

    // Register event interpreters.
    if (null != order) {
        for (var i = 0; i < this._eventInterpreters.length; i++) {
            var alreadyAddedEventInterpreter = this._eventInterpreters[i];

            if (order < alreadyAddedEventInterpreter.order) {
                this._eventInterpreters.splice(i, 0, eventInterpreter);
                added = true;

                break;
            }
        }

        if (!added) {
            this._eventInterpreters.push(eventInterpreter);
        }
    }
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
EventsContainer.prototype.handleRegistryChange = function(items, reset, name) {
    items = utils.clone(items);

    if (!reset) {
        // Register all the definitions.
        for (var id in items) {
            var definition = items[id];

            definition.id = id;
            this._definitions[id] = definition;
        }

        // Check not handled interpretation parameters.
        for (var id in this._definitions) {
            var definition = this._definitions[id];

            for (var parameter in definition) {
                if (!(parameter in {id: true}) && !(parameter in this._handledParameters)) {
                    throw new Error(
                        'The parameter "{0}" is not handled by any of the event interpreter in the interpretation of the event "{1}".'.format(
                            parameter,
                            id
                        )
                    );
                }
            }
        }

        // Instantiate the events.
        this.build(true);
    }
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.setAlias = function(alias, id) {
    this._aliases[alias] = id;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.setDefinition = function(id, definition, rebuild) {
    definition.id = id;
    this._definitions[id] = definition;

    if (false !== rebuild) {
        this.build(true);
    }
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.getDefinition = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this.hasDefinition(id)) {
        throw new Error(
            'The event of id "{0}" does not exist.'.format(
                id
            )
        );
    }

    return this._definitions[id];
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.hasDefinition = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._definitions[id] ? true : false;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.getInterpretation = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this.hasInterpretation(id)) {
        this._interpretations[id] = interpret.call(
            this,
            this.getDefinition(id),
            this._context
        );
    }

    return this._interpretations[id];
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.hasInterpretation = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._interpretations[id] ? true : false;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.build = function(reset) {
    // Remove the built events.
    if (reset) {
        resetEvents.call(this);
    }

    // Build context.
    for (var id in this._definitions) {
        this._context = buildContext.call(this, this._context, this._definitions[id]);
    }

    // Interpret.
    for (var id in this._definitions) {
        if (!this.hasInterpretation(id)) {
            this._interpretations[id] = this.getInterpretation(id);
        }
    }

    // Build.
    for (var id in this._interpretations) {
        if (!this.has(id)) {
            this._events[id] = this.get(id);
            this._events[id].id = id;
        }
    }
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.get = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this.has(id)) {
        this._events[id] = build.call(this, this.getInterpretation(id));
        this._events[id].id = id;
    }

    return this._events[id];
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.has = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._events[id] ? true : false;
}

/**
 * Reset the events.
 *
 * @api private
 */
var resetEvents = function() {
    this._context = {};
    this._interpretations = {};
    this._events = {};
    this._aliases = {};
}

/**
 * Build context for a event.
 *
 * @param {object} context The current context.
 * @param {object} definition The event definition.
 * @return {object} The new context.
 * @api private
 */
var buildContext = function(context, definition) {
    for (var i = 0; i < this._eventInterpreters.length; i++) {
        context = this._eventInterpreters[i].buildContext(context, definition);
    }

    return context;
}

/**
 * Interpret a event.
 *
 * @param {object} definition The event definition.
 * @return {object} The interpretation.
 * @api private
 */
var interpret = function(definition, context) {
    var interpretation = [];

    for (var i = 0; i < this._eventInterpreters.length; i++) {
        interpretation = this._eventInterpreters[i].interpret(
            interpretation,
            definition,
            context
        );
    }

    return interpretation;
}

/**
 * Build a event.
 *
 * @param {object} interpretation The event interpretation.
 * @return {function} The event.
 * @api private
 */
var build = function(interpretation) {
    var self = this,
        operations = []
    ;

    for (var i = 0; i < interpretation.length; i++) {
        operations.push(buildParallelOperations.call(this, interpretation[i].operations));
    }

    var operation = function(flow, callback) {
        var flowOperations = [];

        for (var i = 0; i < operations.length; i++) {
            (function(operation) {
                flowOperations.push(function(callback) {
                    return operation(flow, callback);
                });
            })(operations[i])
        }


        if (undefined === callback) {
            var task = flow.wait();

            callback = function() {
                flow.end(task);
            };
        }

        self._flowDriver.series(flowOperations, callback);
    };

    return this._eventProvider.provide(operation);
}

/**
 * Build parallel operations of a event.
 *
 * @param {object} parallelOperations The operations.
 * @return {function} The event.
 * @api private
 */
var buildParallelOperations = function(operations) {
    var self = this;

    return function(flow, callback) {
        var flowOperations = [];

        for (var i = 0; i < operations.length; i++) {
            (function(operation) {
                flowOperations.push(function(callback) {
                    return operation(flow, callback);
                });
            })(operations[i])
        }

        var task = flow.wait(),
            parallelCallback = function() {
                flow.end(task);
                callback(null);
            }
        ;

        self._flowDriver.parallel(flowOperations, parallelCallback);
    };
}
