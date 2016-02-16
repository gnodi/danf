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
}

utils.extend(Abstract, Socket);

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
        return {
            event: {
                type: 'string',
                required: true
            },
            namespace: {
                format: function(value) {
                    return formatPath(value);
                },
                type: 'string',
                default: '/'
            },
            target: {
                type: 'string',
                default: '-',
                validate: function(value) {
                    if (!isValidTarget(value)) {
                        throw new Error('one of ["{0}"] (room being the name of a room)'.format(
                            [
                                '-',
                                '+',
                                '*',
                                '+room',
                                '*room'
                            ].join('", "')
                        ));
                    }
                }
            },
            volatile: {
                type: 'boolean',
                default: false
            }
        };
    }
});

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
                    escapedReferences = ['@', '$', '&', '~', '!']
                ;

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
                        function(stream) {
                            try {
                                stream._context = JSON.stringify(self._app.clientContext);

                                self._renderer.render(request, response, stream, view, function(content) {
                                    for (var headerName in headers) {
                                        response.set(headerName, headers[headerName]);
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
                                        response.send(content);
                                    } else {
                                        var error = new Error();

                                        error.status = response.statusCode;
                                        error.message = content.error ? content.error : '';

                                        throw error;
                                    }
                                });
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
Request.prototype.notifyEvent = function(name, parameters, sequence, data) {
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
            path: data.path,
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
 * Whether or not it is a valid HTTP target.
 *
 * @return {boolean} True if this is a valid target, false otherwise.
 * @api private
 */
var isValidTarget = function(target) {
    return /^[*+\-].*/.test(target);
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
