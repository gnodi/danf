'use strict';

/**
 * Expose `Dom`.
 */
module.exports = Dom;

/**
 * Module dependencies.
 */
var utils = require('../../../common/utils'),
    Abstract = require('../../../common/event/notifier/abstract')
;

/**
 * Initialize a new jquery notifier.
 *
 * @param {danf:manipulation.dataResolver} dataResolver The data resolver.
 * @param {danf:vendor.jquery} jquery Dom.
 */
function Dom(jquery, dataResolver) {
    if (jquery) {
        this.jquery = jquery;
    }

    Abstract.call(this, dataResolver);
}

utils.extend(Abstract, Dom);

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Dom.prototype, 'name', {
    value: 'dom'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Dom.prototype, 'contract', {
    value: {
        selector: {
            type: 'string'
        },
        delegate: {
            type: 'string'
        },
        event: {
            type: 'string',
            required: true
        },
        preventDefault: {
            type: 'boolean',
            default: false
        },
        stopPropagation: {
            type: 'boolean',
            default: false
        }
    }
});

/**
 * Set the jquery lib dependency.
 *
 * @param {object} jquery Dom.
 */
Object.defineProperty(Dom.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @inheritdoc
 */
Dom.prototype.addEventListener = function(name, event, sequencer) {
    var $ = this._jquery,
        wrappedCallback = wrapCallback(
            name,
            sequencer,
            event.preventDefault,
            event.stopPropagation
        )
    ;

    switch (event.event) {
        case 'ready':
            $(document).ready(wrappedCallback);

            break;
        default:
            if (event.delegate) {
                $(document).ready(function() {
                    if (event.selector) {
                        var selector = 'window' === event.selector ? window : event.selector;

                        $(selector).on(event.event, event.delegate, wrappedCallback);
                    } else {
                        $(document).on(event.event, event.delegate, wrappedCallback);
                    }
                });
            } else {
                $(document).ready(function() {
                    if (event.selector) {
                        var selector = 'window' === event.selector ? window : event.selector;

                        $(selector).on(event.event, wrappedCallback);
                    } else {
                        $(document).on(event.event, wrappedCallback);
                    }
                });
            }
    }
}

/**
 * @interface {danf:event.notifier}
 */
Dom.prototype.refreshListeners = function(data) {
    var $ = this._jquery;

    // Refresh all.
    if (null == data || null == data.scope) {
        // Unbind all events.
        $(document).off();

        for (var name in this._listeners) {
            var event = this._listeners[name].event;

            if (event.selector) {
                $(event.selector).off();
            }
        }

        // Rebind all events.
        for (var name in this._listeners) {
            var listener = this._listeners[name];

            this.addEventListener(name, listener.event, listener.sequencer);
        }
    // Refresh events on a scope.
    } else {
        var scope = data.scope;

        // Unbind events on a scope.
        for (var name in this._listeners) {
            var event = this._listeners[name].event;

            if (event.selector) {
                scope.find(event.selector).off();
            }
        }

        // Rebind events on a scope.
        for (var name in this._listeners) {
            var listener = this._listeners[name],
                event = listener.event,
                selector = 'window' === event.selector ? window : event.selector,
                wrappedCallback = wrapCallback(
                    name,
                    listener.sequencer,
                    event.preventDefault,
                    event.stopPropagation
                )
            ;

            switch (event.event) {
                case 'ready':
                    break;
                default:
                    if (selector) {
                        if (event.delegate) {
                            $(document).ready(function() {
                                scope.find(selector).on(event.event, event.delegate, wrappedCallback);
                            });
                        } else {
                            $(document).ready(function() {
                                scope.find(selector).on(event.event, wrappedCallback);
                            });
                        }
                    }
            }
        }
    }
}

/**
 * @inheritdoc
 */
Dom.prototype.notifyEvent = function(name, event, sequencer, data) {
    var $ = this._jquery;

    switch (event.event) {
        case 'ready':
        case 'ajaxReady':
            $(document).trigger('ajaxReady', data);

            break;
        default:
            if (event.selector) {
                $(event.selector).trigger(event.event, data);
            } else {
                $(document).trigger(event.event, data);
            }
    };
}

/**
 * Wrap the sequencer mechanism in a jquery event type callback.
 *
 * @param {string} name The name of the event.
 * @param {danf:manipulation.sequencer} sequencer The sequencer.
 * @param {boolean} preventDefault Whether or not to prevent default behaviour (see jquery doc).
 * @param {boolean} stopPropagation Whether or not to stop the bubbling of the event (see jquery doc).
 */
var wrapCallback = function(name, sequencer, preventDefault, stopPropagation) {
    return function(event) {
        var args = Array.prototype.slice.call(arguments, 1),
            data = {}
        ;

        if (args.length === 1) {
            data = args[0];
        } else if (args >= 2) {
            data = args;
        }

        if (preventDefault) {
            event.preventDefault();
        }
        if (stopPropagation) {
            event.stopPropagation();
        }

        sequencer.start({
            name: name,
            data: data || {},
            event: event
        });
    }
}