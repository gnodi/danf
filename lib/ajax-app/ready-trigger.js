'use strict';

define(function(require) {
    /**
     * Initialize a new ready trigger.
     *
     * @param {danf:event.eventTrigger} eventTrigger The event trigger.
     */
    function ReadyTrigger(eventTrigger) {
        if (eventTrigger) {
            this.eventTrigger = eventTrigger;
        }
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

    /**
     * Expose `ReadyTrigger`.
     */
    return ReadyTrigger;
});