'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../event/notifier/abstract')
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

    this._enabled = false;
    this._debug = true;
    Object.hasMethod(this, 'addSocketListener', true);
}

utils.extend(Abstract, Socket);

Socket.defineAsAbstract();

Socket.defineDependency('_debug', 'boolean');
Socket.defineDependency('_socketIo', 'function');
Socket.defineDependency('_logger', 'danf:logging.logger');

/**
 * Whether or not the application is in debug mode.
 *
 * @var {boolean}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'debug', {
    set: function(debug) { this._debug = debug ? true : false; }
});

/**
 * Socket IO lib.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'socketIo', {
    set: function(socketIo) { this._socketIo = socketIo; }
});

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
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Socket.prototype, 'name', {
    value: 'socket'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Socket.prototype, 'contract', {
    get: function () {
        var specificContract = this.getSpecificContract(),
            contract = {
                namespace: {
                    format: function(value) {
                        return formatPath(value);
                    },
                    type: 'string',
                    default: '/'
                }
            }
        ;

        return utils.merge(contract, specificContract);
    }
});

/**
 * Get the specific contract that a socket event kind should respect.
 *
 * @param {danf:event.event} event The event.
 * @return {object} The contract.
 * @api protected
 */
Socket.prototype.getSpecificContract = function() {
    return {};
};

/**
 * @inheritdoc
 */
Socket.prototype.addEventListener = function(name, parameters, sequence) {
    var self = this,
        addListener = function(socket) {
            socket.on(name, function(data, acknowledge) {
                var stream = data,
                    context = {socket: socket}
                ;

                if (socket.request) {
                    context.request = socket.request;

                    if (socket.request.session) {
                        context.session = socket.request.session;
                    }
                }

                try {
                    if (parameters.data) {
                        stream = self._dataResolver.resolve(
                            stream,
                            parameters.data,
                            'socket[{0}]'.format(name)
                        );
                    }

                    sequence.execute(
                        stream,
                        context,
                        null,
                        function(errors, stream) {
                            var error = new Error(
                                    'Socket message "{0}" sequence processing failed.'.format(name)
                                )
                            ;

                            error.embedded = errors;

                            self.handleError(error, name, acknowledge);
                        }
                    );
                } catch (error) {
                    self.handleError(error, name, acknowledge);
                }
            });
        }
    ;

    this.addSocketListener(addListener);
}

/**
 * Add a socket listener.
 *
 * @param {function} addListener The function adding the listener.
 * @api protected
 */
Socket.prototype.addSocketListener = null; // function(addListener) {}

/**
 * Handle a socket error.
 *
 * @param {error} error The error.
 * @param {string} name The event name.
 * @param {function} acknowledge The acknowledgement callback.
 * @api protected
 */
Socket.prototype.handleError = function(error, name, acknowledge) {
    if (error.embedded && error.embedded.length === 1) {
        error = error.embedded[0];
    }

    // Send the error to the client.
    if (acknowledge) {
        var message = 'An error occured for the socket message "{O}{1}"'.format(
                name,
                this._debug
                    ? ': {0}'.format(error.message)
                    : '.'
            )
        ;

        acknowledge({error: message});
    }

    // Log the error.
    if (error.embedded) {
        this._logger.log('<<error>><<bold>>{0}'.format(error.message), 1);

        for (var i = 0; i < error.embedded.length; i++) {
            this._logger.log('<<error>>{0}'.format(error.embedded[i].message), 1);
            this._logger.log(
                '<<grey>>{0}'.format(
                    error.embedded[i].stack.replace(error.embedded[i].message, '')
                ),
                2,
                1,
                0
            );
        }
    } else {
        this._logger.log('<<error>>{0}'.format(error.message), 1);
        this._logger.log(
            '<<grey>>{0}'.format(
                error.stack.replace(error.message, '')
            ),
            2,
            1,
            0
        );
    }
}

/**
 * Format a path.
 *
 * @param {string} path The path.
 * @return {string} The formatted path.
 * @api private
 */
var formatPath = function(path) {
    if ('string' === typeof value) {
        path = '/' !== value[0] ? '/' + value : value;
    }

    return path;
}
