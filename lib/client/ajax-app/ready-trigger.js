'use strict';

/**
 * Expose `ReadyTrigger`.
 */
module.exports = ReadyTrigger;

/**
 * Initialize a new ready trigger.
 */
function ReadyTrigger() {
}

ReadyTrigger.defineImplementedInterfaces(['danf:ajaxApp.readyTrigger']);

ReadyTrigger.defineDependency('_readyEvent', 'danf:event.event');

/**
 * Set the ready event.
 *
 * @param {danf:event.event}
 * @api public
 */
Object.defineProperty(ReadyTrigger.prototype, 'readyEvent', {
    set: function(readyEvent) { this._readyEvent = readyEvent; }
});

/**
 * @interface {danf:ajaxApp.readyTrigger}
 */
ReadyTrigger.prototype.trigger = function(data) {
    this._readyEvent.trigger(data);
}