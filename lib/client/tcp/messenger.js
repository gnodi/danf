'use strict';

/**
 * Expose `Messenger`.
 */
module.exports = Messenger;

/**
 * Initialize a new messenger notifier.
 */
function Messenger() {
}

Messenger.defineImplementedInterfaces(['danf:tcp.messenger']);

Messenger.defineDependency('_event', 'danf:event.event');

/**
 * Forwarding event.
 *
 * @var {danf:event.event}
 * @api public
 */
Object.defineProperty(Messenger.prototype, 'event', {
    set: function(event) { this._event = event; }
});

/**
 * @interface {danf:tcp.messenger}
 */
Messenger.prototype.emit = function(name, data) {
    this._event.trigger(
        data,
        {
            forward: name
        }
    );
}