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
 */
function Dom() {
    Abstract.call(this);
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
Dom.prototype.addEventListener = function(name, parameters, sequence) {
    var $ = this._jquery,
        wrappedCallback = wrapCallback(
            name,
            sequence,
            parameters.preventDefault,
            parameters.stopPropagation
        )
    ;

    switch (parameters.event) {
        case 'ready':
            $(document).ready(wrappedCallback);

            break;
        default:
            if (parameters.delegate) {
                $(document).ready(function() {
                    if (parameters.selector) {
                        var selector = 'window' === parameters.selector ? window : parameters.selector;

                        $(selector).on(parameters.event, parameters.delegate, wrappedCallback);
                    } else {
                        $(document).on(parameters.event, parameters.delegate, wrappedCallback);
                    }
                });
            } else {
                $(document).ready(function() {
                    if (parameters.selector) {
                        var selector = 'window' === parameters.selector ? window : parameters.selector;

                        $(selector).on(parameters.event, wrappedCallback);
                    } else {
                        $(document).on(parameters.event, wrappedCallback);
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

            this.addEventListener(name, listener.event, listener.sequence);
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
                    listener.sequence,
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
Dom.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var $ = this._jquery;

    switch (parameters.event) {
        case 'ready':
        case 'ajaxReady':
            $(document).trigger('ajaxReady', data);

            break;
        default:
            if (parameters.selector) {
                $(parameters.selector).trigger(parameters.event, data);
            } else {
                $(document).trigger(parameters.event, data);
            }
    };
}

/**
 * Wrap the sequence mechanism in a jquery event type callback.
 *
 * @param {string} name The name of the event.
 * @param {danf:event.sequence} sequence The sequence.
 * @param {boolean} preventDefault Whether or not to prevent default behaviour (see jquery doc).
 * @param {boolean} stopPropagation Whether or not to stop the bubbling of the event (see jquery doc).
 */
var wrapCallback = function(name, sequence, preventDefault, stopPropagation) {
    return function(event) {
        var stream = Array.prototype.slice.call(arguments, 1);

        if (preventDefault) {
            event.preventDefault();
        }
        if (stopPropagation) {
            event.stopPropagation();
        }

        sequence.execute(
            stream,
            {
                name: name,
                event: event
            },
            '.'
        );
    }
}