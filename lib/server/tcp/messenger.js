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
Messenger.defineDependency('_sessionHandler', 'danf:http.sessionHandler');

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Messenger.prototype, 'app', {
    set: function(app) { this._app = app; }
});

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
 * Session handler.
 *
 * @var {danf:http.sessionHandler}
 * @api public
 */
Object.defineProperty(Messenger.prototype, 'sessionHandler', {
    set: function(sessionHandler) { this._sessionHandler = sessionHandler; }
});

/**
 * @interface {danf:tcp.messenger}
 */
Messenger.prototype.emit = function(name, data, target) {
    this._event.trigger(
        data,
        {
            target: target,
            forward: name
        }
    );
}

/**
 * @interface {danf:tcp.messenger}
 */
Messenger.prototype.joinRoom = function(room) {
    var socketId = this._sessionHandler.get('socket'),
        socket = this._app.io.sockets.connected[socketId]
    ;

    if (socket) {
        socket.join(room);
    }
}

/**
 * @interface {danf:tcp.messenger}
 */
Messenger.prototype.leaveRoom = function(room) {
    var socketId = this._sessionHandler.get('socket'),
        socket = this._app.io.sockets.connected[socketId]
    ;

    if (socket) {
        socket.leave(room);
    }
}