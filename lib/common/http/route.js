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
Route.defineDependency('_hostname', 'string');
Route.defineDependency('_port', 'number|null');
Route.defineDependency('_method', 'string');
Route.defineDependency('_event', 'danf:event.event');

/**
 * Path.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'path', {
    set: function(path) {
        path = formatPath(path);

        this._path = path;

        // Handle case where path is already a regexp.
        if (path instanceof RegExp) {
            this._regexp = path;
        // Handle string path.
        } else {
            var pattern = -1 !== path.indexOf('?')
                    ? '^{0}$'
                    : '^{0}(?:\\/|\\?.*)?$'
            ;

            this._regexp = new RegExp(pattern.format(path
                .replace(/[-[\]{}()*+?.,\\^$\/|#\s]/g, '\\$&')
                .replace(/(\/|=):[^\/]+/g, '$1[^\\/]+')
            ));
        }
    },
    get: function() { return this._path; }
});

/**
 * Host.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'host', {
    set: function(host) {
        var hostParts = host.toLowerCase().split(':');

        this._hostname = hostParts[0];
        this._port = hostParts[1];
    },
    get: function() {
        return this._port
            ? '{0}:{1}'.format(this._hostname, this._port)
            : this._hostname
        ;
    }
});

/**
 * Hostname.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'hostname', {
    set: function(hostname) { this._hostname = hostname.toLowerCase(); },
    get: function() { return this._hostname; }
});

/**
 * Port.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'port', {
    set: function(port) { this._port = port; },
    get: function() { return this._port; }
});

/**
 * HTTP method.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Route.prototype, 'method', {
    set: function(method) { this._method = method.toUpperCase(); },
    get: function() { return this._method; }
});

/**
 * Event.
 *
 * @var {danf:event.event}
 * @api public
 */
Object.defineProperty(Route.prototype, 'event', {
    set: function(event) { this._event = event; },
    get: function() { return this._event; }
});

/**
 * @interface {danf:event.route}
 */
Route.prototype.match = function(path, method, host) {
    return ((!host && 'localhost' === this.host) || this.host === host)
        && method.toUpperCase() === this._method
        && this._regexp.test(formatPath(path))
    ;
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

    return this._path.replace(/(\/):([^\/?]+)|(=):([^&]+)(?:&|$)/g, function(match, $1, $2, $3, $4) {
        if (
            'object' !== typeof parameters
            || ($1 && null == parameters[$2])
            || ($3 && null == parameters[$4])
        ) {
            throw new Error(
                'Route [{0}]"{1}" needs a parameter "{2}".'.format(
                    self._method,
                    self._path,
                    $2 || $4
                )
            );
        }

        return '{0}{1}'.format($1 || $3, $1 ? parameters[$2] : parameters[$4]);
    });
}

/**
 * @interface {danf:event.route}
 */
Route.prototype.follow = function(parameters, headers, meta) {
    var hasMetaPath = meta && meta.path,
        hasMetaHost = meta && meta.host,
        path = hasMetaPath ? meta.path : this.resolve(parameters),
        host = hasMetaHost ? meta.host : this.host,
        data = {},
        params = parameters
    ;

    data.path = path;
    data.method = this._method;
    data.headers = headers || {};

    // Try to match informations coming from metadata.
    if (hasMetaPath || hasMetaHost) {
        if (
            !this.match(
                path,
                this._method,
                host
            )
        ) {
            throw new Error(
                'Path "{0}" for host "{1}" does not match route [{2}]"{3}" of "{4}".'.format(
                    path,
                    host,
                    this._method,
                    this._path,
                    this.host
                )
            );
        }
    }

    // Clone parameters and remove those which are in the query string.
    if ('object' === typeof parameters) {
        params = {};

        for (var key in parameters) {
            var value = parameters[key];

            params[key] = 'function' === typeof value
                ? value()
                : value
            ;
        }
    }

    data.parameters = params;

    // Add meta data.
    if (meta && meta.protocol) {
        data.protocol = meta.protocol;
    }
    data.hostname = this._hostname;
    if (this._port) {
        data.port = this._port;
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
    }

    return path;
}