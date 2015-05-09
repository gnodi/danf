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
