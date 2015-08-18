'use strict';

/**
 * Expose `EventsContainer`.
 */
module.exports = EventsContainer;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new events container.
 *
 * @param {danf:dependencyInjection.servicesContainer} servicesContainer The services container.
 * @param {danf:event.sequencesContainer} sequencesContainer The sequences container.
 * @param {danf:dependencyInjection.provider<danf:event.event>} eventProvider The event provider.
 */
function EventsContainer(servicesContainer, sequencesContainer, eventProvider) {
    this._definitions = {};
    this._notifiers = {};

    if (servicesContainer) {
        this.servicesContainer = servicesContainer;
    }
    if (sequencesContainer) {
        this.sequencesContainer = sequencesContainer;
    }
    if (eventProvider) {
        this.eventProvider = eventProvider;
    }

    resetEvents.call(this);
}

EventsContainer.defineImplementedInterfaces(['danf:event.eventsContainer', 'danf:manipulation.registryObserver']);

EventsContainer.defineDependency('_sequencesContainer', 'danf:event.sequencesContainer');
EventsContainer.defineDependency('_eventProvider', 'danf:dependencyInjection.provider', 'danf:event.event');
EventsContainer.defineDependency('_notifiers', 'danf:event.notifier_object');

/**
 * Set the sequences container.
 *
 * @param {danf:event.sequencesContainer} sequencesContainer The sequences container.
 * @api public
 */
Object.defineProperty(EventsContainer.prototype, 'sequencesContainer', {
    set: function(sequencesContainer) { this._sequencesContainer = sequencesContainer; }
});

/**
 * Set the event provider.
 *
 * @param {danf:dependencyInjection.provider<danf:event.event>} The event provider.
 * @api public
 */
Object.defineProperty(EventsContainer.prototype, 'eventProvider', {
    set: function(eventProvider) { this._eventProvider = eventProvider; }
});

/**
 * Set the notifiers.
 *
 * @param {danf:event.notifier_array} notifiers The notifiers.
 * @api public
 */
Object.defineProperty(EventsContainer.prototype, 'notifiers', {
    set: function(notifiers) {
        this._notifiers = {};

        for (var i = 0; i < notifiers.length; i++) {
            this.setNotifier(notifiers[i]);
        }
    }
});

/**
 * Set a notifier.
 *
 * @param {danf:event.notifier} notifier The notifier.
 * @api public
 */
EventsContainer.prototype.setNotifier = function(notifier) {
    this._notifiers[notifier.name] = notifier;
    this._definitions[notifier.name] = {};
    this._events[notifier.name] = {};
    this._aliases[notifier.name] = {};
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
EventsContainer.prototype.handleRegistryChange = function(items, reset, name) {
    if (!reset) {
        for (var type in items) {
            for (var id in items[type]) {
                this.setDefinition(type, id, items[type][id]);
            }
        }
    }

    this.build(false);
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.setAlias = function(alias, type, id) {
    checkTypeHandling.call(this, type);

    this._aliases[type][alias] = id;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.setDefinition = function(type, id, definition) {
    checkTypeHandling.call(this, type);

    this._definitions[type][id] = definition;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.getDefinition = function(type, id) {
    checkTypeHandling.call(this, type);

    id = this._aliases[type][id] ? this._aliases[type][id] : id;

    if (!this.hasDefinition(type, id)) {
        throw new Error(
            'The event of type "{0}" and id "{1}" does not exist.'.format(
                type,
                id
            )
        );
    }

    return this._definitions[type][id];
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.hasDefinition = function(type, id) {
    checkTypeHandling.call(this, type);

    id = this._aliases[type][id] ? this._aliases[type][id] : id;

    return this._definitions[type][id] ? true : false;
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.build = function(reset) {
    // Remove the built events.
    if (reset) {
        resetEvents.call(this);
    }

    // Build.
    for (var type in this._definitions) {
        for (var id in this._definitions[type]) {
            if (!this.has(type, id)) {
                this._events[type][id] = this.get(type, id);
            }
        }
    }
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.get = function(type, id) {
    checkTypeHandling.call(this, type);

    id = this._aliases[type][id] ? this._aliases[type][id] : id;

    if (!this.has(type, id)) {
        var sequenceId = 'danf:event.{0}.{1}'.format(type, id),
            definition = this.getDefinition(type, id)
        ;

        this._sequencesContainer.setDefinition(
            sequenceId,
            {children: definition.sequences}
        );

        var notifier = getNotifier.call(this, type),
            sequence = this._sequencesContainer.get(sequenceId),
            event = this._eventProvider.provide({
                name: id,
                parameters: definition,
                sequence: sequence,
                notifier: notifier
            })
        ;

        notifier.addListener(event);

        this._events[type][id] = event;
    }

    return this._events[type][id];
}

/**
 * @interface {danf:event.eventsContainer}
 */
EventsContainer.prototype.has = function(type, id) {
    checkTypeHandling.call(this, type);

    id = this._aliases[type][id] ? this._aliases[type][id] : id;

    return this._events[type][id] ? true : false;
}

/**
 * Retrieve a notifier.
 *
 * @param {string} type The type handled by the notifier.
 * @param {danf:event.notifier} The notifier.
 * @throws {error} If the type is not handled.
 * @api private
 */
var getNotifier = function(type) {
    checkTypeHandling.call(this, type);

    return this._notifiers[type];
}

/**
 * Check if a type is handled.
 *
 * @param {string} type The type.
 * @throws {error} If the type is not handled.
 * @api private
 */
var checkTypeHandling = function(type) {
    if (undefined === this._notifiers[type]) {
        throw new Error(
            'No notifier found handling the event type "{0}".'.format(
                type
            )
        );
    }
}

/**
 * Reset the events.
 *
 * @api private
 */
var resetEvents = function() {
    this._events = {};
    this._aliases = {};
}