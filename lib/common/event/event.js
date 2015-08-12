'use strict';

/**
 * Expose `Event`.
 */
module.exports = Event;

/**
 * Initialize a new event.
 *
 * @param {object} parameters The parameters.
 * @param {danf:event.notifier} notifier The notifier.
 */
function Event(parameters, notifier) {
    if (parameters) {
        this.parameters = parameters;
    }
    if (notifier) {
        this.notifier = notifier;
    }
}

Event.defineImplementedInterfaces(['danf:event.event']);

Event.defineDependency('_parameters', 'object');
Event.defineDependency('_notifier', 'danf:event.notifier');

/**
 * Set the parameters of the event.
 *
 * @param {object} The parameters.
 * @api public
 */
Object.defineProperty(Event.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; }
});

/**
 * @interface {danf:event.event}
 */
Object.defineProperty(Event.prototype, 'notifier', {
    set: function(notifier) { this._notifier = notifier; }
});

/**
 * @interface {danf:event.event}
 */
Event.prototype.trigger = function(data) {
    this._notifier.notify(this._parameters, data);
}