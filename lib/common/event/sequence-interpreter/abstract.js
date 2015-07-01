'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract sequence interpreter.
 *
 * @param {danf:event.sequencesContainer} The sequences container.
 * @api private
 */
function Abstract(sequencesContainer) {
    if (sequencesContainer) {
        this.sequencesContainer = sequencesContainer;
    }
}

Abstract.defineImplementedInterfaces(['danf:event.sequenceInterpreter']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_sequencesContainer', 'danf:event.sequencesContainer');

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
 * @interface {danf:event.sequenceInterpreter}
 */
Object.defineProperty(Abstract.prototype, 'order', {
    get: function() { return this._order; }
});

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Abstract.prototype.buildContext = function(context, definition) {
    return context;
}

/**
 * @interface {danf:event.sequenceInterpreter}
 */
Abstract.prototype.interpret = function(sequence, definition, context) {
    return sequence;
}
