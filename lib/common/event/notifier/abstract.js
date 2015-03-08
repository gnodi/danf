'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new abstract notifier.
     *
     * @param {danf:manipulation.dataResolver} dataResolver The data resolver.
     */
    function Abstract(dataResolver) {
        this._listeners = {};
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
    Abstract.prototype.addListener = function(name, event, sequencer) {
        this._listeners[name] = {
            event: event,
            sequencer: sequencer
        };

        this.addEventListener(name, event, sequencer);
    }

    /**
     * Add an event listener.
     *
     * @param {string} name The name of the event.
     * @param {object} event The description of the event.
     * @param {danf:manipulation.sequencer} sequencer The sequencer to process on event triggering.
     * @api protected
     */
    Abstract.prototype.addEventListener = function(name, event, sequencer) {
    }

    /**
     * @interface {danf:event.notifier}
     */
    Abstract.prototype.refreshListeners = function() {
    }

    /**
     * @interface {danf:event.notifier}
     */
    Abstract.prototype.notify = function(name, data) {
        var listener = this._listeners[name];

        if (listener) {
            if (listener.event.contract) {
                this._dataResolver.resolve(
                    data,
                    listener.event.contract,
                    'event[{0}][{1}].data'.format(this.name, name)
                );
            }

            this.notifyEvent(name, listener.event, listener.sequencer, data);
        }
    }

    /**
     * Notify an event triggering.
     *
     * @param {string} name The name of the event.
     * @param {object} event The description of the event.
     * @param {danf:manipulation.sequencer} sequencer The sequencer to process on event triggering.
     * @param {mixed} data The data associated with the triggered event.
     * @api protected
     */
    Abstract.prototype.notifyEvent = null; // function(name, event, sequencer, data) {}

    /**
     * Expose `Abstract`.
     */
    return Abstract;
});