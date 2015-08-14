'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract notifier.
 *
 * @param {danf:manipulation.dataResolver} dataResolver The data resolver.
 */
function Abstract(dataResolver) {
    this._listeners = [];
    if (dataResolver) {
        this.dataResolver = dataResolver;
    }

    Object.hasMethod(this, 'notifyEvent', true);
}

Abstract.defineImplementedInterfaces(['danf:event.notifier']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_dataResolver', 'danf:manipulation.dataResolver');

/**
 * Set the data resolver.
 *
 * @param {danf:manipulation.dataResolver}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'dataResolver', {
    set: function(dataResolver) { this._dataResolver = dataResolver; }
});

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.addListener = function(event) {
    this._listeners.push(event);

    this.addEventListener(event.name, event.parameters, event.sequence);
}

/**
 * Add an event listener.
 *
 * @param {string} name The name of the event.
 * @param {object} event The parameters of the event.
 * @param {danf:event.sequence} sequence The sequence to execute on event triggering.
 * @api protected
 */
Abstract.prototype.addEventListener = function(name, parameters, sequence) {
}

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.refreshListeners = function() {
}

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.notify = function(event, data) {
    if (undefined === event) {
        throw new Error('No event of name "{0}" found.'.format(event.name));
    }

    if (event.parameters.contract) {
        this._dataResolver.resolve(
            data,
            event.parameters.contract,
            'event[{0}][{1}].data'.format(this.name, event.name)
        );
    }

    this.notifyEvent(event.name, event.parameters, event.sequence, data);
}

/**
 * Notify an event triggering.
 *
 * @param {string} name The name of the event.
 * @param {object} event The parameters of the event.
 * @param {danf:event.sequence} sequence The sequence to execute on event triggering.
 * @param {mixed} data The data associated with the triggered event.
 * @api protected
 */
Abstract.prototype.notifyEvent = null; // function(name, parameters, sequence, data) {}