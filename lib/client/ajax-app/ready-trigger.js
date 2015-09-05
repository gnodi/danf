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

ReadyTrigger.defineDependency('_eventTrigger', 'danf:event.eventTrigger');

/**
 * Set the event trigger.
 *
 * @param {danf:event.eventTrigger}
 * @api public
 */
Object.defineProperty(ReadyTrigger.prototype, 'eventTrigger', {
    set: function(eventTrigger) { this._eventTrigger = eventTrigger; }
});

/**
 * @interface {danf:ajaxApp.readyTrigger}
 */
ReadyTrigger.prototype.trigger = function(data) {
    this._eventTrigger.trigger(
        'dom',
        'danf:ajaxApp.ajaxReady',
        this,
        data || {}
    );
}