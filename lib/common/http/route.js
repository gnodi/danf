'use strict';

/**
 * Expose `Route`.
 */
module.exports = Route;

/**
 * Initialize a new route.
 */
function Route() {
}

Route.defineImplementedInterfaces(['danf:http.route']);

Route.defineDependency('_path', 'string|regexp');
Route.defineDependency('_method', 'string');
Route.defineDependency('_event', 'danf:event.event');

/**
 * Set the path.
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'path', {
    set: function(path) {
        path = formatPath(path);

        this._path = path;
        this._regexp = path instanceof RegExp
            ? path
            : new RegExp(path
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                .replace(/\/:[^\/]+\//g, '/[^\\/]+/')
            )
        ;
    },
    get: function() { return this._path; }
});

/**
 * Get/set the HTTP method.
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'method', {
    set: function(method) { this._method = method.toUpperCase(); },
    get: function() { return this._method; }
});

/**
 * Get/set the event.
 *
 * @param {danf:event.event}
 * @api public
 */
Object.defineProperty(Route.prototype, 'event', {
    set: function(event) { this._event = event; },
    get: function() { return this._event; }
});

/**
 * @interface {danf:event.route}
 */
Route.prototype.match = function(path, method) {
    path = formatPath(path);

    return method.toUpperCase() === this._method && this._regexp.test(path);
}

/**
 * @interface {danf:event.route}
 */
Route.prototype.resolve = function(parameters) {
    var self = this;

    if ('string' !== typeof this.path) {
        throw new Error(
            'Cannot resolve route [{0}]"{1}" defined by a regular expression.'.format(
                this._method,
                this._path
            )
        );
    }

    return this._path.replace(/\/(?::([^\/?]+)\/?)|(?:=:([^&]+)(?:&|$))/g, function(match, $1) {
        if ('object' !== typeof parameters || null == parameters[$1]) {
            throw new Error(
                'Route [{0}]"{1}" need a parameter "{2}".'.format(
                    self._method,
                    self._path,
                    $1
                )
            );
        }

        return parameters[$1];
    });
}

/**
 * @interface {danf:event.route}
 */
Route.prototype.follow = function(parameters, headers, meta) {
    var hasMetaPath = meta && meta.path,
        path = hasMetaPath ? meta.path : this.resolve(parameters),
        data = {},
        params = parameters
    ;

    data.path = path;
    data.method = this._method;
    data.headers = headers || {};

    if (hasMetaPath) {
        if (!this.match(path, this._method)) {
            throw new Error(
                'The meta path "{0}" doest not match route [{1}]"{2}".'.format(
                    path,
                    this._method,
                    this._path
                )
            );
        }
    }

    // Clone parameters and remove those which are in the query string.
    if (!hasMetaPath && 'object' === typeof parameters) {
        params = {};

        for (var key in parameters) {
            params[key] = parameters[key];
        }

        this._path.replace(/\/(?::([^\/?]+)\/?)|(?:=:([^&]+)(?:&|$))/g, function(match, $1) {
            delete params[$1];
        });
    }

    data.parameters = params;

    // Copy meta in data.
    if (meta) {
        if (meta.protocol) {
            data.protocol;
        }
        if (meta.hostname) {
            data.hostname;
        }
        if (meta.port) {
            data.port;
        }
    }

    this._event.trigger(data);
}

/**
 * Format a path.
 *
 * @param {string} path The path.
 * @return {string} The formatted path.
 * @api private
 */
var formatPath = function(path) {
    if ('string' === typeof path) {
        if (!/^\//.test(path)) {
            path = '/' + path;
        }
        if (!/\/$/.test(path)) {
            path += '/';
        }
    }

    return path;
}