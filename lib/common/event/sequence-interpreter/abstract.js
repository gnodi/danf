'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract sequence builder.
 *
 * @param {danf:event.sequencesContainer} The sequences container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api private
 */
function Abstract(sequencesContainer, referenceResolver) {
    this.sequencesContainer = sequencesContainer;
    this.referenceResolver = referenceResolver;
}

Abstract.defineImplementedInterfaces(['danf:event.sequenceInterpreter']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_sequencesContainer', 'danf:event.sequencesContainer');
Abstract.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

/**
 * Set the sequences container.
 *
 * @param {danf:event.sequencesContainer} The sequences container.
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'sequencesContainer', {
    set: function(sequencesContainer) {
        this._sequencesContainer = sequencesContainer
    }
});

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Abstract.prototype, 'order', {
    get: function() { return this._order; }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Abstract.prototype.interpret = function(sequence) {
    return sequence;
}

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Abstract.prototype.build = function(sequence) {
    return sequence;
}

/**
 * Resolve arguments.
 *
 * @param {mixed_object} args The arguments.
 * @param {danf:manipulation.flow} flow The current flow.
 * @return {mixed_object} The resolved arguments.
 * @api protected
 */
Abstract.prototype.resolveArguments = function(args, flow) {
    var resolvedArguments = Array.isArray(args) ? [] : {};

    for (var key in args) {
        var argument = args[key];

        if ('string' === typeof argument) {
            argument = this._referenceResolver.resolve(argument, '@', flow.currentStream);

            if ('string' === typeof argument) {
                argument = this._referenceResolver.resolve(argument, '$', this._sequencesContainer.config);
            }
        }

        resolvedArguments[key] = argument;
    }

    return resolvedArguments;
}