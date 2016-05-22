'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    Abstract = require('../../../../common/http/event/notifier/request')
;

/**
 * Expose `Request`.
 */
module.exports = Request;

/**
 * Initialize a new request notifier.
 */
function Request() {
    Abstract.call(this);
}

utils.extend(Abstract, Request);

Request.defineDependency('_app', 'function');
Request.defineDependency('_escaper', 'danf:manipulation.escaper');
Request.defineDependency('_renderer', 'danf:rendering.renderer');
Request.defineDependency('_errorHandler', 'danf:http.errorHandler');
Request.defineDependency('_logger', 'danf:logging.logger');

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Request.prototype, 'name', {
    value: 'request'
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Request.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * Escaper.
 *
 * @var {danf:manipulation.escaper}
 * @api public
 */
Object.defineProperty(Request.prototype, 'escaper', {
    set: function(escaper) { this._escaper = escaper; }
});

/**
 * Renderer.
 *
 * @var {danf:rendering.renderer}
 * @api public
 */
Object.defineProperty(Request.prototype, 'renderer', {
    set: function(renderer) { this._renderer = renderer; }
});

/**
 * Error handler.
 *
 * @var {danf:http.errorHandler}
 * @api public
 */
Object.defineProperty(Request.prototype, 'errorHandler', {
    set: function(errorHandler) { this._errorHandler = errorHandler; }
});

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Request.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * @inheritdoc
 */
Request.prototype.getSpecificContract = function() {
    return {
        view: this._renderer.contract
    };
}

/**
 * @inheritdoc
 */
Request.prototype.addEventListener = function(name, parameters, sequence) {
    var self = this,
        path = parameters.path ? parameters.path : '/',
        headers = parameters.headers,
        methods = parameters.methods,
        params = parameters.parameters,
        view = parameters.view
    ;

    for (var i = 0; i < methods.length; i++) {
        (function(method) {
            self._app[method](path, function(request, response, next) {
                var stream = utils.merge(request.query, request.params),
                    errored = false,
                    escapedReferences = ['@', '$', '&', '~', '!'],
                    socketId = request.session.socket || 0,
                    socket = self._app.io
                        ? self._app.io.sockets.connected[socketId]
                        : null
                ;

                // Synchronize socket session.
                if (socket) {
                    socket.request.session = request.session;
                }

                // Escape stream to prevent parameters injection.
                stream = self._escaper.escape(stream, escapedReferences);

                try {
                    if (params) {
                        try {
                            stream = self._dataResolver.resolve(
                                stream,
                                params,
                                'request[{0}]'.format(name)
                            );
                        } catch (error) {
                            error.status = 400;

                            throw error;
                        }
                    }

                    sequence.execute(
                        stream,
                        {
                            request: request,
                            response: response
                        },
                        '.',
                        function(errors, stream) {
                            var error = new Error(
                                    'Request "{0}" sequence processing failed.'.format(name)
                                )
                            ;

                            errored = true;
                            error.embedded = errors;

                            handleRequestError.call(self, response, error);
                        },
                        function(stream) {
                            try {
                                if (!errored) {
                                    stream._context = JSON.stringify(self._app.clientContext);

                                    self._renderer.render(request, response, stream, view, function(content) {
                                        for (var headerName in headers) {
                                            response.set(headerName, headers[headerName]);
                                        }

                                        // Synchronize socket session.
                                        if (socket) {
                                            socket.request.session = request.session;
                                        }

                                        // Process double unescaping.
                                        content = self._escaper.unescape(content, escapedReferences);
                                        content = self._escaper.unescape(content, escapedReferences);

                                        if (null == response.statusCode || 200 === response.statusCode) {
                                            if ('post' === method) {
                                                response.statusCode = 201;
                                            } else if (null == content || '' === content) {
                                                response.statusCode = 204;
                                            } else {
                                                response.statusCode = 200;
                                            }
                                        }

                                        if (response.statusCode < 300) {
                                            response.set('X-Danf-Path', request.originalUrl);
                                            response.send(content);
                                        } else {
                                            var error = new Error();

                                            error.status = response.statusCode;
                                            error.message = content.error ? content.error : '';

                                            throw error;
                                        }
                                    });
                                }
                            } catch (error) {
                                handleRequestError.call(self, response, error);
                            }
                        }
                    );
                } catch (error) {
                    handleRequestError.call(self, response, error);
                }
            });
        })(methods[i].toLowerCase());
    }
}

/**
 * @inheritdoc
 */
Request.prototype.notifyEvent = function(name, parameters, sequence, data, meta) {
    var callback = data.callback,
        parameters = 'object' === typeof data.parameters
            ? querystring.stringify(data.parameters)
            : data.parameters
        ,
        path = data.path,
        body = ''
    ;

    if ('GET' === data.method && '' !== parameters) {
        path = '{0}{1}{2}'.format(
            path,
            -1 === path.indexOf('?') ? '?' : '&',
            parameters
        );
    } else {
        body = parameters;
    }

    var options = {
            path: path,
            method: data.method,
            port: data.port ? data.port : this._app.context.port,
            protocol: data.protocol,
            headers: data.headers
        },
        requestCallback
    ;

    if (data.hostname) {
        options.hostname = data.hostname;
    }

    this.executeRequest(options, body);
}

/**
 * Execute a request.
 *
 * @param {object} options The metadatas of the request.
 * @param {string} body The data of the request.
 * @api protected
 */
Request.prototype.executeRequest = function(options, body) {
    this.__asyncProcess(function(async) {
        var protocol = /^https:/i.test(options.protocol)
                ? https
                : http
            ,
            request = protocol.request(options, function(response) {
                var content = ''

                response.on('data', function(chunk) {
                    content += chunk;
                });

                response.on('end', async(function() {
                    return content;
                }));
            })
        ;

        if ('' !== body) {
            request.write(body);
        }

        request.end();
    });
}

/**
 * Handle a request error and redirection.
 *
 * @param {object} response The express response object.
 * @param {error} error The error.
 * @api private
 */
var handleRequestError = function(response, error) {
    error = this._errorHandler.process(error);
    response.statusCode = error.status;

    // Handle redirect.
    if (response.statusCode < 400) {
        response.redirect(response.statusCode, error.message);
    // Handle error.
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

        if (error.name === error.message) {
            response.send('{0}'.format(error.message));
        } else {
            response.send('{0}: {1}'.format(error.name, error.message));
        }
    }
}