'use strict';

/**
 * Expose `SequencesContainer`.
 */
module.exports = SequencesContainer;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new sequences container.
 *
 * @param {danf:manipulation.flowDriver} The flow driver.
 * @param {danf:dependencyInjection.provider<danf:manipulation:sequence>} sequenceProvider The sequence provider.
 */
function SequencesContainer(flowDriver, sequenceProvider) {
    this._definitions = {};
    this._context = {};
    this._sequenceInterpreters = [];
    this._handledParameters = {};

    if (flowDriver) {
        this.flowDriver = flowDriver;
    }
    if (sequenceProvider) {
        this.sequenceProvider = sequenceProvider;
    }

    resetSequences.call(this);
}

SequencesContainer.defineImplementedInterfaces(['danf:event.sequencesContainer', 'danf:manipulation.registryObserver']);

SequencesContainer.defineDependency('_sequenceInterpreters', 'danf:event.sequenceInterpreter_array');
SequencesContainer.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');
SequencesContainer.defineDependency('_sequenceProvider', 'danf:dependencyInjection.provider', 'danf:event.sequence');

/**
 * Set the flow driver.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(SequencesContainer.prototype, 'flowDriver', {
    set: function(flowDriver) { this._flowDriver = flowDriver; }
});

/**
 * Set the sequence provider.
 *
 * @param {danf:dependencyInjection.provider<danf:manipulation:sequence>} The sequence provider.
 * @api public
 */
Object.defineProperty(SequencesContainer.prototype, 'sequenceProvider', {
    set: function(sequenceProvider) { this._sequenceProvider = sequenceProvider; }
});

/**
 * @interface {danf:event.sequencesContainer}
 */
Object.defineProperty(SequencesContainer.prototype, 'handledParameters', {
    get: function() { return this._handledParameters }
});

/**
 * Add a sequence interpreter.
 *
 * @param {danf:event.sequenceInterpreter} sequenceInterpreter The sequence interpreter.
 * @api public
 */
SequencesContainer.prototype.addSequenceInterpreter = function(sequenceInterpreter) {
    Object.checkType(sequenceInterpreter, 'danf:event.sequenceInterpreter');

    var added = false,
        order = sequenceInterpreter.order
    ;

    // Register handled parameters.
    this._handledParameters = utils.merge(this._handledParameters, sequenceInterpreter.contract);

    // Register sequence interpreters.
    if (null != order) {
        for (var i = 0; i < this._sequenceInterpreters.length; i++) {
            var alreadyAddedSequenceInterpreter = this._sequenceInterpreters[i];

            if (order < alreadyAddedSequenceInterpreter.order) {
                this._sequenceInterpreters.splice(i, 0, sequenceInterpreter);
                added = true;

                break;
            }
        }

        if (!added) {
            this._sequenceInterpreters.push(sequenceInterpreter);
        }
    }
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
SequencesContainer.prototype.handleRegistryChange = function(items, reset, name) {
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
                        'The parameter "{0}" is not handled by any of the sequence interpreter in the interpretation of the sequence "{1}".'.format(
                            parameter,
                            id
                        )
                    );
                }
            }
        }

        // Instantiate the sequences.
        this.build(true);
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.setAlias = function(alias, id) {
    this._aliases[alias] = id;
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.setDefinition = function(id, definition, rebuild) {
    definition.id = id;
    this._definitions[id] = definition;

    if (false !== rebuild) {
        this.build(true);
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.getDefinition = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this.hasDefinition(id)) {
        throw new Error(
            'The sequence of id "{0}" does not exist.'.format(
                id
            )
        );
    }

    return this._definitions[id];
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.hasDefinition = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._definitions[id] ? true : false;
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.getInterpretation = function(id) {
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
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.hasInterpretation = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._interpretations[id] ? true : false;
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.build = function(reset) {
    // Remove the built sequences.
    if (reset) {
        resetSequences.call(this);
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
            this._sequences[id] = this.get(id);
            this._sequences[id].id = id;
        }
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.get = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this.has(id)) {
        this._sequences[id] = build.call(this, this.getInterpretation(id));
        this._sequences[id].id = id;
    }

    return this._sequences[id];
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.has = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    return this._sequences[id] ? true : false;
}

/**
 * Reset the sequences.
 *
 * @api private
 */
var resetSequences = function() {
    this._context = {};
    this._interpretations = {};
    this._sequences = {};
    this._aliases = {};
}

/**
 * Build context for a sequence.
 *
 * @param {object} context The current context.
 * @param {object} definition The sequence definition.
 * @return {object} The new context.
 * @api private
 */
var buildContext = function(context, definition) {
    for (var i = 0; i < this._sequenceInterpreters.length; i++) {
        context = this._sequenceInterpreters[i].buildContext(context, definition);
    }

    return context;
}

/**
 * Interpret a sequence.
 *
 * @param {object} definition The sequence definition.
 * @return {object} The interpretation.
 * @api private
 */
var interpret = function(definition, context) {
    var interpretation = [];

    for (var i = 0; i < this._sequenceInterpreters.length; i++) {
        interpretation = this._sequenceInterpreters[i].interpret(
            interpretation,
            definition,
            context
        );
    }

    return interpretation;
}

/**
 * Build a sequence.
 *
 * @param {object} interpretation The sequence interpretation.
 * @return {function} The sequence.
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

    return this._sequenceProvider.provide(operation);
}

/**
 * Build parallel operations of a sequence.
 *
 * @param {object} parallelOperations The operations.
 * @return {function} The sequence.
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
