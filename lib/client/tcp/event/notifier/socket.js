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
}

utils.extend(Abstract, Socket);

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * Socket object.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(Socket.prototype, 'socket', {
    get: function() {
        if (!this._socket) {
            this._socket = this._socketIo();
        }

        return this._socket;
    }
});

/**
 * @inheritdoc
 */
Socket.prototype.getEventMetaContract = function() {
    return {
        forward: {
            type: 'string'
        }
    };
};

/**
 * @inheritdoc
 */
Socket.prototype.addSocketListener = function(addListener) {
    addListener(this.socket);
}

/**
 * @inheritdoc
 */
Socket.prototype.notifyEvent = function(name, parameters, sequence, data, meta) {
    if (null == this._socket) {
        throw new Error('The current client does not handle socket messages.');
    }

    if ('danf:tcp.forwarder' === name) {
        name = meta.forward;
    }

    var self = this;

    this._socket.emit(name, data, function(acknowledgement) {
        if (
            acknowledgement &&
            'object' === typeof acknowledgement &&
            acknowledgement.error
        ) {
            var message = data.error || acknowledgement.error;

            self._logger.log('<<error>>{0}'.format(message), 1);

            throw new Error(message);
        } else {
            self._logger.log(data, 1);
        }
    });
}