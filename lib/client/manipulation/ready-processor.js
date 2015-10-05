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
ReadyProcessor.defineDependency('_processingEvent', 'danf:event.event');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(ReadyProcessor.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the processing event.
 *
 * @param {danf:event.event}
 * @api public
 */
Object.defineProperty(ReadyProcessor.prototype, 'processingEvent', {
    set: function(processingEvent) { this._processingEvent = processingEvent; }
});

/**
 * @interface {danf:manipulation.readyProcessor}
 */
ReadyProcessor.prototype.process = function(scope) {
    this._processingEvent.trigger(
        {scope: (scope ? this._jquery(scope) : null)}
    );
}