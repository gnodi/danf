'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract sequence interpreter.
 */
function Abstract() {
}

Abstract.defineImplementedInterfaces(['danf:event.sequenceInterpreter']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_sequencesContainer', 'danf:event.sequencesContainer');
Abstract.defineDependency('_logger', 'danf:event.logger');

/**
 * Sequences container.
 *
 * @var {danf:event.sequencesContainer}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'sequencesContainer', {
    set: function(sequencesContainer) {
        this._sequencesContainer = sequencesContainer
    }
});

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'logger', {
    set: function(logger) {
        this._logger = logger
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
