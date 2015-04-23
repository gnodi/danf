'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract event processor.
 *
 * @param {function} jquery JQuery.
 * @param {danf:event.eventTrigger} eventTrigger The event trigger.
 */
function Abstract(jquery, eventTrigger) {
    if (jquery) {
        this.jquery = jquery;
    }
    if (eventTrigger) {
        this.eventTrigger = eventTrigger;
    }
}

Abstract.defineImplementedInterfaces(['danf:ajaxApp.processor']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_jquery', 'function');
Abstract.defineDependency('_eventTrigger', 'danf:event.eventTrigger');

/**
 * Set jquery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Set the event trigger.
 *
 * @param {danf.event.eventTrigger}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'eventTrigger', {
    set: function(eventTrigger) { this._eventTrigger = eventTrigger; }
});