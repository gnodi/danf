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
 */
function SequencesContainer(flowDriver) {
    this._definitions = {};
    this._config = {};
    this._sequenceInterpreters = [];
    this._handledParameters = {};

    if (flowDriver) {
        this.flowDriver = flowDriver;
    }

    resetSequences.call(this);
}

SequencesContainer.defineImplementedInterfaces(['danf:event.sequencesContainer', 'danf:manipulation.registryObserver']);

SequencesContainer.defineDependency('_sequenceInterpreters', 'danf:event.sequenceInterpreter_array');
SequencesContainer.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');

/**
 * @interface {danf:event.sequencesContainer}
 */
Object.defineProperty(SequencesContainer.prototype, 'config', {
    get: function() { return this._config; },
    set: function(config) { this._config = utils.clone(config); }
});

/**
 * @interface {danf:event.sequencesContainer}
 */
Object.defineProperty(SequencesContainer.prototype, 'handledParameters', {
    get: function() { return this._handledParameters }
});

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
    this._definitions[id] = define.call(this, definition);

    if (rebuild) {
        this.build(true);
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.getDefinition = function(id) {
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
    return this._definitions[id] ? true : false;
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.setInterpretation = function(id, interpretation) {
    interpretation.id = id;
    this._interpretations[id] = define.call(this, interpretation);
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.getInterpretation = function(id) {
    if (!this.hasDefinition(id)) {
        throw new Error(
            'The sequence of id "{0}" does not exist.'.format(
                id
            )
        );
    }
    if (!this.hasInterpretation(id)) {
        this._interpretations[id] = interpret.call(this, this.getDefinition(id));
        this._interpretations[id].id = id;
    }

    return this._interpretations[id];
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.hasInterpretation = function(id) {
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

    // Interpret.
    for (var id in this._definitions) {
        if (!this.hasInterpretation(id)) {
            this._interpretations[id] = interpret.call(this, this._definitions[id]);
            this._interpretations[id].id = id;
        }
    }

    // Build.
    for (var id in this._sequences) {
        if (!this.has(id)) {
            this._sequences[id] = build.call(this, this._interpretations[id]);
            this._sequences[id].id = id;
        }
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.get = function(id) {
    id = this._aliases[id] ? this._aliases[id] : id;

    if (!this._sequences[id]) {
        for (var i = 0; i < this._buildTree.length; i++) {
            if (id === this._buildTree[i]) {
                this._buildTree.push(id);

                throw new Error(
                    'The circular dependency ["{0}"] prevent to build the sequence "{1}".'.format(
                        this._buildTree.join('" -> "'),
                        id
                    )
                );
            }
        }

        this._buildTree.push(id);
        this._sequences[id] = build.call(this, this.getInterpretation(id));
        this._buildTree.pop();
    }

    return this._sequences[id];
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.set = function(id, sequence) {
    if ('string' !== typeof id) {
        throw new Error(
            'The id of a sequence must be a "string"; "{0}" given instead.'.format(
                typeof id
            )
        );
    }

    if ('object' !== typeof sequence && 'function' !== typeof sequence) {
        throw new Error(
            'The sequence of id "{0}" must be an "object"; "{1}" given instead.'.format(
                id,
                typeof sequence
            )
        );
    }

    // Removing.
    if (null == sequence) {
        delete this._sequences[id];
    // Replacement.
    } else {
        this._sequences[id] = sequence;
    }
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.unset = function(id) {
    delete this._sequences[id];
}

/**
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.has = function(id) {
    return this._sequences[id] ? true : false;
}

/**
 * Reset the sequences.
 *
 * @api private
 */
var resetSequences = function() {
    this._interpretations = {};
    this._sequences = {};
    this._aliases = {};
    this._buildTree = [];
}

/**
 * Interpret a sequence.
 *
 * @param {object} definition The sequence definition.
 * @return {object} The interpretation.
 * @api private
 */
var interpret = function(definition) {
    var interpretation = [];

    for (var i = 0; i < this._sequenceInterpreters.length; i++) {
        interpretation = this._sequenceInterpreters[i].interpret(interpretation, definition);
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
        operations.push(buildParallelOperations.call(this, interpretation[i]));
    }

    return function(flow, callback) {
        self._flowDriver.series(operations, callback);
    };
}

/**
 * Build parallel operations of a sequence.
 *
 * @param {object} parallelOperations The operations.
 * @return {function} The sequence.
 * @api private
 */
var buildParallelOperations = function(parallelOperations) {
    var self = this,
        operations = []
    ;

    for (var i = 0; i < parallelOperations.length; i++) {
        operations.push(buildOperation.call(this, parallelOperations[i]));
    }

    return function(flow, callback) {
        self._flowDriver.parallel(operations, callback);
    };
}

/**
 * Build an operation of a sequence.
 *
 * @param {object} interpretation The sequence interpretation.
 * @return {function} The sequence.
 * @api private
 */
var buildOperation = function(operation) {
    if ('function' === typeof operation) {
        return operation;
    }

    // TODO: handle case of children/parents operation.
}
