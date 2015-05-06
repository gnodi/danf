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
function SequencesContainer(referenceResolver) {
    this._referenceResolver = referenceResolver;

    this._definitions = {};
    this._sequences = {};
    this._aliases = {};
    this._config = {};

    this._sequenceInterpreters = [];
    this._sequenceBuilders = [];
    this._handledParameters = {};
    this._buildTree = [];
}

SequencesContainer.defineImplementedInterfaces(['danf:event.sequencesContainer', 'danf:manipulation.registryObserver']);

SequencesContainer.defineDependency('_sequenceBuilders', 'danf:event.sequenceBuilder_array');
SequencesContainer.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

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
 * Add a sequence builder.
 *
 * @param {danf:event.sequenceBuilder} sequenceBuilder The sequence builder.
 * @api public
 */
SequencesContainer.prototype.addSequenceBuilder = function(sequenceBuilder) {
    Object.checkType(sequenceBuilder, 'danf:event.sequenceBuilder');

    var added = false,
        interpretationOrder = sequenceBuilder.interpretationOrder,
        buildingOrder = sequenceBuilder.buildingOrder
    ;

    // Register handled parameters.
    this._handledParameters = utils.merge(this._handledParameters, sequenceBuilder.contract);

    // Register sequence interpreters.
    if (null != interpretationOrder) {
        for (var j = 0; j < this._sequenceInterpreters.length; j++) {
            var alreadyAddedSequenceInterpreter = this._sequenceInterpreters[j];

            if (interpretationOrder < alreadyAddedSequenceInterpreter.interpretationOrder) {
                this._sequenceInterpreters.splice(j, 0, sequenceBuilder);
                added = true;

                break;
            }
        }

        if (!added) {
            this._sequenceDefiners.push(sequenceBuilder);
        }
    }

    // Register sequence builders.
    if (null != buildingOrder) {
        added = false;

        for (var j = 0; j < this._sequenceBuilders.length; j++) {
            var alreadyAddedSequenceBuilder = this._sequenceBuilders[j];

            if (buildingOrder < alreadyAddedSequenceBuilder.buildingOrder) {
                this._sequenceBuilders.splice(j, 0, sequenceBuilder);
                added = true;

                break;
            }
        }

        if (!added) {
            this._sequenceBuilders.push(sequenceBuilder);
        }
    }
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
SequencesContainer.prototype.handleRegistryChange = function(items, reset, name) {
    items = utils.clone(items);
    this._buildTree = [];

    // Reset the list of existing definitions.
    this._aliases = {};
    this._dependencies = {};

    // Remove the sequences with a definition.
    for (var id in this._sequences) {
        if (this.hasDefinition(id)) {
            var definition = this.getDefinition(id);

            if (!definition.lock) {
                delete this._sequences[id];
            }
        }
    }

    this._definitions = {};

    if (!reset) {
        // Register all the definitions.
        for (var id in items) {
            var definition = items[id];

            definition.id = id;
            this._definitions[id] = definition;
        }

        // Check not handled definition parameters.
        for (var id in this._definitions) {
            var definition = this._definitions[id];

            for (var parameter in definition) {
                if (!(parameter in {id: true}) && !(parameter in this._handledParameters)) {
                    throw new Error(
                        'The parameter "{0}" is not handled by any of the sequence builders in the definition of the sequence "{1}".'.format(
                            parameter,
                            id
                        )
                    );
                }
            }
        }

        // Define.
        for (var id in this._definitions) {
            this._definitions[id] = define.call(this, this._definitions[id]);
        }

        // Update the old instantiated sequences.
        for (var id in this._sequences) {
            if (this.hasDefinition(id)) {
                update.call(this, id);
            }
        }

        // Instantiate the sequences.
        this.build(false);
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
SequencesContainer.prototype.setDefinition = function(id, definition) {
    definition.id = id;
    this._definitions[id] = define.call(this, definition);
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
SequencesContainer.prototype.build = function(reset) {
    if (reset) {
        for (var sequenceId in this._sequences) {
            if (this.hasDefinition(sequenceId)) {
                delete this._sequences[sequenceId];
            }
        }
    }

    for (var sequenceId in this._definitions) {
        if (!this._definitions[sequenceId].abstract) {
            this.get(sequenceId);
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
        this._sequences[id] = instantiate.call(this, id);
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

    // Impact the dependencies.
    var dependencies = this._dependencies[id];

    if (dependencies) {
        for (var dependencyId in dependencies) {
            var dependency = this.get(dependencyId);

            for (var propertyName in dependencies[dependencyId]) {
                var index = dependencies[dependencyId][propertyName];

                // Simple value.
                if (null === index) {
                    dependency[propertyName] = sequence;
                // Object value.
                } else {
                    var propertyValue = dependency[propertyName];

                    if (null == propertyValue) {
                        if ('number' === typeof index) {
                            propertyValue = [];
                        } else {
                            propertyValue = {};
                        }
                    }

                    // Removing.
                    if (null == sequence) {
                        if (Array.isArray(propertyValue)) {
                            propertyValue.splice(index, 1);
                        } else {
                            delete propertyValue[index];
                        }
                    // Replacement.
                    } else {
                        propertyValue[index] = sequence;
                    }

                    dependency[propertyName] = propertyValue;
                }
            }
        }
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
 * @interface {danf:event.sequencesContainer}
 */
SequencesContainer.prototype.setDependency = function(id, dependencyId, property, index) {
    if (!this._dependencies[id]) {
        this._dependencies[id] = {};
    }
    if (!this._dependencies[id][dependencyId]) {
        this._dependencies[id][dependencyId] = {};
    }
    this._dependencies[id][dependencyId][property] = index;
}

/**
 * Interpret a sequence.
 *
 * @param {Object} definition The sequence definition.
 * @return {object} The handled definition.
 * @api private
 */
var interpret = function(definition) {
    for (var i = 0; i < this._sequenceInterpreters.length; i++) {
        definition = this._sequenceInterpreters[i].interpret(definition);
    }

    return definition;
}

/**
 * Build a sequence.
 *
 * @param {String} id
 * @return {Object}
 * @api private
 */
var build = function(id) {
    var definition = utils.clone(this.getDefinition(id)),
        sequence = function() {}
    ;

    for (var i = 0; i < this._sequenceBuilders.length; i++) {
        instance = this._sequenceBuilders[i].build(sequence, definition);
    }

    return sequence;
}