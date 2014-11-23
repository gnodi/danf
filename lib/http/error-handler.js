'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new error handler.
     */
    function ErrorHandler(debug) {
        this.debug = debug;

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
     * @param {boolean}
     * @api public
     */
    Object.defineProperty(ErrorHandler.prototype, 'debug', {
        set: function(debug) { this._debug = debug ? true : false; }
    });

    /**
     * @interface {danf:error.errorHandler}
     */
    ErrorHandler.prototype.process = function(error) {
        if (undefined === error.status) {
            var errorMessage = '' + error.message;

            if (errorMessage in this._messages) {
                error.status = parseInt(errorMessage, 10);
                error.message = this._messages[errorMessage];
            } else {
                error.status = 500;
            }
        }

        var message = this._messages['' + error.status];

        if (this._debug) {
            error.name = message;
        } else {
            error.name = message;
            error.message = message;
        }

        return error;
    }

    /**
     * Expose `ErrorHandler`.
     */
    return ErrorHandler;
});