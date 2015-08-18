'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    http = require('http'),
    querystring = require('querystring'),
    Abstract = require('../../../../common/event/notifier/abstract')
;

/**
 * Expose `Request`.
 */
module.exports = Request;

/**
 * Initialize a new request notifier.
 *
 * @param {danf:manipulation.dataResolver} dataResolver The data resolver.
 * @param {function} app The app.
 * @param {danf:rendering.renderer} renderer The renderer.
 * @param {danf:http.errorHandler} errorHandler The error handler.
 * @param {danf:dependencyInjection.contextProvider<object>} requestProvider The request provider.
 * @param {danf:dependencyInjection.contextProvider<object>} responseProvider The response provider.
 */
function Request(dataResolver, app, renderer, errorHandler, requestProvider, responseProvider) {
    Abstract.call(this, dataResolver);

    if (app) {
        this.app = app;
    }
    if (renderer) {
        this.renderer = renderer;
    }
    if (errorHandler) {
        this.errorHandler = errorHandler;
    }
    if (requestProvider) {
        this.requestProvider = requestProvider;
    }
    if (responseProvider) {
        this.responseProvider = responseProvider;
    }
}

utils.extend(Abstract, Request);

Request.defineDependency('_app', 'function');
Request.defineDependency('_renderer', 'danf:rendering.renderer');
Request.defineDependency('_errorHandler', 'danf:http.errorHandler');
Request.defineDependency('_requestProvider', 'danf:dependencyInjection.contextProvider', 'object');
Request.defineDependency('_responseProvider', 'danf:dependencyInjection.contextProvider', 'object');

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Request.prototype, 'name', {
    value: 'request'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Request.prototype, 'contract', {
    get: function () {
        return {
            path: {
                type: 'string',
                required: true
            },
            headers: {
                type: 'string_object',
            },
            methods: {
                type: 'string_array',
                required: true
            },
            parameters: {
                type: 'mixed_object'
            },
            view: this._renderer.contract
        };
    }
});

/**
 * Set the app.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(Request.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * Set the renderer.
 *
 * @param {danf:rendering.renderer}
 * @api public
 */
Object.defineProperty(Request.prototype, 'renderer', {
    set: function(renderer) { this._renderer = renderer; }
});

/**
 * Set the error handler.
 *
 * @param {danf:http.errorHandler}
 * @api public
 */
Object.defineProperty(Request.prototype, 'errorHandler', {
    set: function(errorHandler) { this._errorHandler = errorHandler; }
});

/**
 * Set the request provider.
 *
 * @param {danf:manipulation.contextProvider<object>}
 * @api public
 */
Object.defineProperty(Request.prototype, 'requestProvider', {
    set: function(requestProvider) { this._requestProvider = requestProvider; }
});

/**
 * Set the response provider.
 *
 * @param {danf:manipulation.contextProvider<object>}
 * @api public
 */
Object.defineProperty(Request.prototype, 'responseProvider', {
    set: function(responseProvider) { this._responseProvider = responseProvider; }
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
                    errored = false
                ;

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
                        '.',
                        function(stream) {
                            try {
                                stream._context = JSON.stringify(self._app.clientContext);

                                self._renderer.render(request, response, stream, view, function(content) {
                                    for (var headerName in headers) {
                                        response.set(headerName, headers[headerName]);
                                    }

                                    if ('post' === method) {
                                        response.statusCode = 201;
                                        response.send(content);
                                    } else if (!content) {
                                        response.statusCode = 204;
                                        response.send();
                                    } else {
                                        response.statusCode = 200;
                                        response.send(content);
                                    }
                                });
                            } catch (error) {
                                error = self._errorHandler.process(error);
                                response.statusCode = error.status;
                                response.send('{0}: {1}'.format(error.name, error.message));
                            }
                        }
                    );

                    /*sequencer.start(
                        stream,
                        function(stream) {
                            try {
                                stream._context = JSON.stringify(self._app.clientContext);

                                self._renderer.render(request, response, stream, view, function(content) {
                                    for (var headerName in headers) {
                                        response.set(headerName, headers[headerName]);
                                    }

                                    if ('post' === method) {
                                        response.statusCode = 201;
                                        response.send(content);
                                    } else if (!content) {
                                        response.statusCode = 204;
                                        response.send();
                                    } else {
                                        response.statusCode = 200;
                                        response.send(content);
                                    }
                                });
                            } catch (error) {
                                error = self._errorHandler.process(error);
                                response.statusCode = error.status;
                                response.send('{0}: {1}'.format(error.name, error.message));
                            }
                        },
                        function(reset) {
                            if (reset) {
                                self._requestProvider.unset();
                                self._responseProvider.unset();
                            } else {
                                // Set the current request objects.
                                self._requestProvider.set(request);
                                self._responseProvider.set(response);
                            }
                        }
                    );*/
                } catch (error) {
                    error = self._errorHandler.process(error);
                    response.statusCode = error.status;
                    response.send('{0}: {1}'.format(error.name, error.message));
                }
            });
        })(methods[i].toLowerCase());
    }
}

/**
 * @inheritdoc
 */
Request.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var path = parameters.path ? parameters.path : '/',
        methods = parameters.methods || [],
        method = 'GET',
        callback = data.callback,
        query = '',
        body = ''
    ;

    if (methods.length === 1) {
        method = methods[0];
    } else if (methods.length >= 2) {
        if (data.method) {
            method = data.method;
        } else {
            method = methods[0];
        }
    }

    if (data.query) {
        if ('object' === typeof data.query) {
            query = querystring.stringify(data.query);
        } else {
            query = data.query;
        }
    }

    if (data.body) {
        if ('GET' === method) {
            throw new Error(
                'You cannot have a body for the GET request "{0}" of path "{1}".'.format(
                    name,
                    path
                )
            );
        }

        if ('object' === typeof data.body) {
            body = querystring.stringify(data.body);
        } else {
            body = data.body;
        }
    }

    var options = {
            path: '' !== query ? '{0}?{1}'.format(path, query) : path,
            port: this._app.context.port,
            headers: data.headers
        },
        requestCallback
    ;

    if (callback) {
        Object.checkType(callback, 'function');

        requestCallback = function(response) {
            var content = ''

            response.on('data', function(chunk) {
                content += chunk;
            });

            response.on('end', function() {
                callback(content);
            });
        };
    }

    if (data._requestWrapper) {
        options.body = body;
        data._requestWrapper(options, callback);
    } else {
        var request = http.request(options, requestCallback);

        if ('' !== body) {
            request.write(body);
        }
        request.end();
    }
}