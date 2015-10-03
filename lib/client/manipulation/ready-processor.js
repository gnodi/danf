'use strict';

/**
 * Expose `ReadyProcessor`.
 */
module.exports = ReadyProcessor;

/**
 * Initialize a new ready trigger.
 */
function ReadyProcessor() {
}

ReadyProcessor.defineImplementedInterfaces(['danf:manipulation.readyProcessor']);

ReadyProcessor.defineDependency('_jquery', 'function');
ReadyProcessor.defineDependency('_processingSequence', 'danf:event.sequence');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(BodyProvider.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the processing sequence.
 *
 * @param {danf:event.event}
 * @api public
 */
Object.defineProperty(ReadyProcessor.prototype, 'processingSequence', {
    set: function(processingSequence) { this._processingSequence = processingSequence; }
});

/**
 * @interface {danf:manipulation.readyProcessor}
 */
ReadyProcessor.prototype.process = function(scope) {
    this._processingSequence.execute(
        {scope: (scope ? $(scope) : null)},
        {},
        null
    );
}