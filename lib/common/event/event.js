'use strict';

/**
 * Expose `Event`.
 */
module.exports = Event;

/**
 * Initialize a new event.
 *
 * @param {string} name The name.
 * @param {object} parameters The parameters.
 * @param {danf:event.sequence} sequence The executable sequence.
 * @param {danf:event.notifier} notifier The notifier.
 */
function Event(name, parameters, sequence, notifier) {
    if (name) {
        this.name = name;
    }
    if (parameters) {
        this.parameters = parameters;
    }
    if (sequence) {
        this.sequence = sequence;
    }
    if (notifier) {
        this.notifier = notifier;
    }
}

Event.defineImplementedInterfaces(['danf:event.event']);

Event.defineDependency('_name', 'string');
Event.defineDependency('_parameters', 'object');
Event.defineDependency('_sequence', 'danf:event.sequence');
Event.defineDependency('_notifier', 'danf:event.notifier');

/**
 * @interface {danf:event.event}
 */
Object.defineProperty(Event.prototype, 'name', {
    set: function(name) { this._name = name; },
    get: function() { return this._name; }
});

/**
 * @interface {danf:event.event}
 */
Object.defineProperty(Event.prototype, 'parameters', {
    set: function(parameters) { this._parameters = parameters; },
    get: function() { return this._parameters; }
});

/**
 * @interface {danf:event.event}
 */
Object.defineProperty(Event.prototype, 'sequence', {
    set: function(sequence) { this._sequence = sequence; },
    get: function() { return this._sequence; }
});

/**
 * @interface {danf:event.event}
 */
Object.defineProperty(Event.prototype, 'notifier', {
    set: function(notifier) { this._notifier = notifier; },
    get: function() { return this._notifier; }
});

/**
 * @interface {danf:event.event}
 */
Event.prototype.trigger = function(data) {
    this._notifier.notify(this, data);
}