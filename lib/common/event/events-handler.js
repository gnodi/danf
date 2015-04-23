'use strict';

/**
 * Expose `EventsHandler`.
 */
module.exports = EventsHandler;

/**
 * Initialize a new events handler.
 *
 * @param {danf:event.sequenceBuilder} sequenceBuilder The sequence builder.
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 */
function EventsHandler(sequenceBuilder, modulesTree, namespacer) {
    if (sequenceBuilder) {
        this.sequenceBuilder = sequenceBuilder;
    }
    if (modulesTree) {
        this.modulesTree = modulesTree;
    }
    if (namespacer) {
        this.namespacer = namespacer;
    }
    this._notifiers = {};
}

EventsHandler.defineImplementedInterfaces(['danf:event.eventsHandler', 'danf:event.eventTrigger', 'danf:manipulation.registryObserver']);

EventsHandler.defineDependency('_sequenceBuilder', 'danf:event.sequenceBuilder');
EventsHandler.defineDependency('_modulesTree', 'danf:configuration.modulesTree');
EventsHandler.defineDependency('_namespacer', 'danf:configuration.namespacer');
EventsHandler.defineDependency('_notifiers', 'danf:event.notifier_object');

/**
 * Set the sequence builder.
 *
 * @param {danf:event.sequenceBuilder} sequenceBuilder The sequence builder.
 * @api public
 */
Object.defineProperty(EventsHandler.prototype, 'sequenceBuilder', {
    set: function(sequenceBuilder) { this._sequenceBuilder = sequenceBuilder; }
});

/**
 * Set the modules tree.
 *
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @api public
 */
Object.defineProperty(EventsHandler.prototype, 'modulesTree', {
    set: function(modulesTree) { this._modulesTree = modulesTree; }
});

/**
 * Set the namespacer.
 *
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 * @api public
 */
Object.defineProperty(EventsHandler.prototype, 'namespacer', {
    set: function(namespacer) { this._namespacer = namespacer; }
});

/**
 * Set the notifiers.
 *
 * @param {danf:event.notifier_array} notifiers The notifiers.
 * @api public
 */
Object.defineProperty(EventsHandler.prototype, 'notifiers', {
    set: function(notifiers) {
        this._notifiers = {};

        for (var i = 0; i < notifiers.length; i++) {
            this.addNotifier(notifiers[i]);
        }
    }
});

/**
 * @interface {danf:event.eventsHandler}
 */
EventsHandler.prototype.addNotifier = function(notifier) {
    this._notifiers[notifier.name] = notifier;
}

/**
 * @interface {danf:manipulation.registryObserver}
 */
EventsHandler.prototype.handleRegistryChange = function(items, reset, name) {
    if (!reset) {
        for (var notifierName in items) {
            for (var eventName in items[notifierName]) {
                this.addEvent(notifierName, eventName, items[notifierName][eventName]);
            }
        }
    }
}

/**
 * @interface {danf:event.eventsHandler}
 */
EventsHandler.prototype.addEvent = function(notifierName, name, event) {
    var notifier = this._notifiers[notifierName];

    if (notifier) {
        var sequences = this._sequenceBuilder.compose(event.sequences);

        notifier.addListener(name, event, sequences);
    }
}

/**
 * @interface {danf:event.eventsHandler}
 */
EventsHandler.prototype.trigger = function(notifierName, eventName, trigger, data) {
    var notifier = this._notifiers[notifierName];

    if (notifier) {
        if (trigger && trigger.__metadata) {
            var moduleId = trigger.__metadata.module;

            if (moduleId) {
                var module = this._modulesTree.get(moduleId);

                eventName = this._namespacer.prefix(eventName, module, this._modulesTree);
            }
        }

        notifier.notify(eventName, data);
    }
}