'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../../common/tcp/event/notifier/socket')
;

/**
 * Expose `Socket`.
 */
module.exports = Socket;

/**
 * Initialize a new socket notifier.
 */
function Socket() {
    Abstract.call(this);

    this._pendingListeners = [];
}

utils.extend(Abstract, Socket);

Socket.defineDependency('_app', 'function');
Socket.defineDependency('_sessionHandler', 'danf:http.sessionHandler');

/**
 * IO object.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(Socket.prototype, 'io', {
    get: function() {
        if (undefined === this._io) {
            this._io = this._app.io;
        }

        return this._io;
    }
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * Session handler.
 *
 * @var {danf:http.sessionHandler}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'sessionHandler', {
    set: function(sessionHandler) { this._sessionHandler = sessionHandler; }
});

/**
 * @inheritdoc
 */
Socket.prototype.getEventMetaContract = function() {
    return {
        /*
         * *: send to everyone
         * +: send to everyone except the emitter socket
         * -: send to the emitter socket
         * name: send to the room
         */
        target: {
            type: 'string_array',
            default: ['*'],
            format: function(value) {
                if ('string' === typeof value) {
                    return [value];
                }
            }
        },
        forward: {
            type: 'string'
        }
    };
};

/**
 * @inheritdoc
 */
Socket.prototype.addSocketListener = function(addListener) {
    var self = this;

    if (this.io) {
        this._io.on('connection', function(socket) {
            var id = socket.id,
                session = socket.request.session
            ;

            session.socket = id;
            session.save();

            addListener(socket);
        });
    } else {
        if (0 === this._pendingListeners.length) {
            this._app.on('listening', function() {
                if (self.io && self._pendingListeners.length >= 1) {
                    var listener;

                    while (listener = self._pendingListeners.pop()) {
                        self.addSocketListener(listener);
                    }
                }
            });
        };

        this._pendingListeners.push(addListener);
    }
}

/**
 * @inheritdoc
 */
Socket.prototype.notifyEvent = function(name, parameters, sequence, data, meta) {
    if (undefined === this.io) {
        throw new Error('The current server does not handle socket messages.');
    }

    var socketId,
        socket,
        io = parameters.namespace
            ? this._io.of(parameters.namespace)
            : this._io
    ;

    if (this._sessionHandler.check()) {
        socketId = this._sessionHandler.get('socket');
        socket = this._app.io.sockets.connected[socketId];
    }

    if ('danf:tcp.forwarder' === name) {
        name = meta.forward;
    }

    for (var i in meta.target) {
        var target = meta.target[i];

        switch (target) {
            case '*':
                io.emit(name, data);
                break;
            case '+':
                if (socket) {
                    socket.broadcast.emit(name, data);
                }

                break;
            case '-':
                if (socket) {
                    socket.emit(name, data);
                }

                break;
            default:
                io.to(target).emit(name, data);
        }
    }
}