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
Socket.prototype.addSocketListener = function(addListener) {
    addListener(this.socket);
}

/**
 * @inheritdoc
 */
Socket.prototype.notifyEvent = function(name, parameters, sequence, data) {
    this._io.emit(parameters.event, data, function(acknowledgement) {
        if (
            acknowledgement &&
            'object' === typeof acknowledgement &&
            acknowledgement.error
        ) {
            this._logger.log('<<error>>{0}'.format(data.error), 1);
        } else {
            this._logger.log(data, 1);
        }
    });
}