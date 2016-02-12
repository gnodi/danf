'use strict';

/**
 * Expose `Event`.
 */
module.exports = Event;

/**
 * Initialize a new event.
 */
function Event() {
}

Event.defineImplementedInterfaces(['danf:event.event']);

Event.defineDependency('_name', 'string');
Event.defineDependency('_parameters', 'object');
Event.defineDependency('_sequence', 'danf:sequencing.sequence');
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
    this._notifier.notify(this, null != data ? data : {});
}

/**
 * @interface {danf:event.event}
 */
Event.prototype.setParameter = function(name, value) {
    this._parameters[name] = value;
}

/**
 * @interface {danf:event.event}
 */
Event.prototype.getParameter = function(name) {
    return this._parameters[name];
}

/**
 * @interface {danf:event.event}
 */
Event.prototype.hasParameter = function(name) {
    return undefined !== this._parameters[name];
}