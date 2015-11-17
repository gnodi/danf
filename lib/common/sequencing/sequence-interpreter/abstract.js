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

Abstract.defineImplementedInterfaces(['danf:sequencing.sequenceInterpreter']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_sequencesContainer', 'danf:sequencing.sequencesContainer');
Abstract.defineDependency('_logger', 'danf:sequencing.logger');

/**
 * Sequences container.
 *
 * @var {danf:sequencing.sequencesContainer}
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
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Object.defineProperty(Abstract.prototype, 'order', {
    get: function() { return this._order; }
});

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Abstract.prototype.buildContext = function(context, definition) {
    return context;
}

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Abstract.prototype.interpret = function(sequence, definition, context) {
    return sequence;
}
