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
 * @inheritdoc
 */
Socket.prototype.addSocketListener = function(addListener) {
    if (this.io) {
        this._io.on('connection', addListener);
    } else {
        if (0 === this._pendingListeners.length) {
            var self = this;

            this._app.on('listening', function() {
                if (self.io && self._pendingListeners.length >= 1) {
                    var listener;

                    while (listener = self._pendingListeners.pop()) {
                        self._io.on('connection', listener);
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
Socket.prototype.notifyEvent = function(name, parameters, sequence, data) {
    if (undefined === this.io) {
        throw new Error('The current server does not handle socket messages.');
    }

    this._io.emit(name, data);
}