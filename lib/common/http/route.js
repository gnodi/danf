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
Route.prototype.follow = function(data) {
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