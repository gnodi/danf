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
        ),
        doc = $(document)
    ;

    switch (parameters.event) {
        case 'danf':
            // Apply listeners on scope on triggering.

            break;
        case 'ready':
            doc.ready(function() {
                setTimeout(
                    function() {
                        if (parameters.selector) {
                            $(parameters.selector).each(function() {
                                wrappedCallback({target: this});
                            });
                        } else {
                            wrappedCallback({target: document});
                        }
                    },
                    10
                );
            });

            break;
        default:
            if (parameters.delegate) {
                doc.ready(function() {
                    if (parameters.selector) {
                        var selector = 'window' === parameters.selector ? window : parameters.selector;

                        $(selector).on(parameters.event, parameters.delegate, wrappedCallback);
                    } else {
                        $(document).on(parameters.event, parameters.delegate, wrappedCallback);
                    }
                });
            } else {
                doc.ready(function() {
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
 * Apply listeners on a scope.
 *
 * @param {object} The scope JQuery element.
 * @api protected
 */
Dom.prototype.applyListeners = function(scope) {
    var $ = this._jquery,
        readyListeners = {},
        standardListeners = {},
        listeners = [standardListeners, readyListeners]
    ;

    // Unbind events on the scope.
    for (var name in this._listeners) {
        var parameters = this._listeners[name].parameters;

        if (parameters.selector) {
            scope.find(parameters.selector).off();
        }

        if ('ready' === parameters.event) {
            readyListeners[name] = this._listeners[name];
        } else {
            standardListeners[name] = this._listeners[name];
        }
    }

    // Rebind standard then ready events on the scope.
    for (var i = 0; i < listeners.length; i++) {
        for (var name in listeners[i]) {
            var listener = listeners[i][name],
                parameters = listener.parameters,
                selector = 'window' === parameters.selector ? window : parameters.selector,
                wrappedCallback = wrapCallback(
                    name,
                    listener.sequence,
                    parameters.preventDefault,
                    parameters.stopPropagation
                )
            ;

            switch (parameters.event) {
                case 'ready':
                    if (selector) {
                        $(selector).each(function() {
                            wrappedCallback({target: this});
                        });
                    } else {
                        wrappedCallback({target: document});
                    }

                    break;
                default:
                    if (selector) {
                        if (parameters.delegate) {
                            scope.find(selector).on(parameters.event, parameters.delegate, wrappedCallback);
                        } else {
                            scope.find(selector).on(parameters.event, wrappedCallback);
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
        case 'danf':
            var scope = data.scope ? data.scope : $(document);

            this.applyListeners(scope);

            break;
        case 'ready':
            var wrappedCallback = wrapCallback(
                    name,
                    sequence,
                    parameters.preventDefault,
                    parameters.stopPropagation
                )
            ;

            wrappedCallback();

            break;
        default:
            if (parameters.selector) {
                var selector = 'window' === parameters.selector ? window : parameters.selector;

                $(selector).trigger(parameters.event, data);
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
        var args = Array.prototype.slice.call(arguments, 1),
            stream = 'object' === typeof args[0] ? args[0] : {}
        ;

        stream.args = args;

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