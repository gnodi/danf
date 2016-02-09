'use strict';

/**
 * Expose `ErrorHandler`.
 */
module.exports = ErrorHandler;

/**
 * Initialize a new error handler.
 */
function ErrorHandler() {
    this.debug = true;

    this._messages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        418: 'I\'m a teapot',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Reserved for WebDAV advanced collections expired proposal',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates (Experimental)',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    }
}

ErrorHandler.defineImplementedInterfaces(['danf:http.errorHandler']);

ErrorHandler.defineDependency('_debug', 'boolean');

/**
 * Whether or not the application is in debug mode.
 *
 * @var {boolean}
 * @api public
 */
Object.defineProperty(ErrorHandler.prototype, 'debug', {
    set: function(debug) { this._debug = debug ? true : false; }
});

/**
 * @interface {danf:error.errorHandler}
 */
ErrorHandler.prototype.process = function(error) {
    var self = this;

    // Handle case of only one embedded error.
    if (error.embedded && error.embedded.length === 1) {
        error = error.embedded[0];
    }

    if (undefined === error.status) {
        var formatError = function(error) {
            var errorMessage = String(error.message);

            if (errorMessage in self._messages) {
                error.status = parseInt(errorMessage, 10);
                error.message = self._messages[errorMessage];
            } else if (null == error.status) {
                error.status = 500;
            }

            return error;
        }

        // Handle case of multiple embedded errors.
        if (error.embedded) {
            var messages = [];

            error.status = 0;

            for (var i = 0; i < error.embedded.length; i++) {
                var embeddedError = formatError(error.embedded[i]);

                error.status = Math.max(error.status, embeddedError.status);
                messages.push('[{0}] {1}'.format(
                    embeddedError.status,
                    embeddedError.message
                ));
            }

            error.message += ' ({0})'.format(messages.join('; '));
        // Handle standard error.
        } else {
            formatError(error);
        }
    }

    var message = this._messages['' + error.status];

    // Format error for debug mode.
    if (this._debug) {
        error.name = message;
    } else {
        error.name = message;
        error.message = message;
    }

    return error;
}