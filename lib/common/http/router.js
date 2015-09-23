'use strict';

/**
 * Expose `Router`.
 */
module.exports = Router;

/**
 * Initialize a new router.
 */
function Router() {
    this._routes = {};
    this._methodRoutes = {};
}

Router.defineImplementedInterfaces(['danf:http.router', 'danf:manipulation.registryObserver']);

Router.defineDependency('_routeProvider', 'danf:dependencyInjection.provider', 'danf:http.route');
Router.defineDependency('_eventsContainer', 'danf:event.eventsContainer');
Router.defineDependency('_routes', 'danf:http.route_object');

/**
 * Set the route provider.
 *
 * @param {danf:manipulation.provider<danf:http.route>} The route provider.
 * @api public
 */
Object.defineProperty(Router.prototype, 'routeProvider', {
    set: function(routeProvider) { this._routeProvider = routeProvider; }
});

/**
 * Set the events container.
 *
 * @param {danf:event.eventsContainer}
 * @api public
 */
Object.defineProperty(Router.prototype, 'eventsContainer', {
    set: function(eventsContainer) { this._eventsContainer = eventsContainer; }
});

/**
 * @interface {danf:manipulation.registryObserver}
 */
Router.prototype.handleRegistryChange = function(items, reset, name) {
    if (items['request']) {
        for (var id in items['request']) {
            if (!reset) {
                var request = items['request'][id];

                for (var i = 0; i < request.methods.length; i++) {
                    this.set(
                        id,
                        this._routeProvider.provide({
                            path: request.path,
                            host: request.host,
                            method: request.methods[i],
                            event: this._eventsContainer.get('request', id)
                        })
                    );
                }
            } else {
                this.unset(id);
            }
        }
    }
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.set = function(name, route) {
    if (this._routes[name]) {
        this.unset(name);
    }

    this._routes[name] = route;

    // Use a method routes indexation to increase performances.
    var method = route.method.toUpperCase();

    if (undefined === this._methodRoutes[method]) {
        this._methodRoutes[method] = {};
    }
    this._methodRoutes[method][name] = route;
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.get = function(name) {
    if (null == this._routes[name]) {
        throw new Error('No route of name "{0}" found.'.format(name));
    }

    return this._routes[name];
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.unset = function(name) {
    delete this._routes[name];

    for (var method in this._methodRoutes) {
        delete this._methodRoutes[method][name];
    }
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.find = function(url, method, throwException) {
    // Parse URL in case of a URL string.
    if ('string' === typeof url) {
        url = this.parse(url);
    }

    var method = method.toUpperCase(),
        path = url.path,
        host = url.host
    ;

    if (!/^\//.test(path)) {
        path = '/' + path;
    }

    // Take the first matching route.
    var routes = this._methodRoutes[method];

    for (var name in routes) {
        if (routes[name].match(path, method, host)) {
            return routes[name];
        }
    }

    if (throwException) {
        throw new Error('No route [{0}]"{1}" found for host "{2}".'.format(
            method,
            path,
            host ? host : 'localhost'
        ));
    }

    return null;
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.follow = function(url, method, parameters, headers) {
    if ('string' === typeof parameters) {
        parameters = this.parseQuerystring(parameters);
    } else if (null == parameters) {
        parameters = {};
    }

    var parsedUrl = this.parse(url);

    for (var key in parsedUrl.parameters) {
        parameters[key] = parsedUrl.parameters[key];
    }

    this.find(parsedUrl, method, true).follow(
        parameters,
        headers,
        parsedUrl
    );
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.parse = function(url) {
    if (!/^(http|\/)/.test(url)) {
        url = '/{0}'.format(url);
    }

    var match = url.match(/^(?:(https?\:)\/\/)?((?:([^:\/?#]*)?)(?:\:([0-9]+))?)?((\/[^?#]*)(\?[^#]*|))(#.*|)$/);

    if (null === match) {
        throw new Error('The url "{0}" is not well formatted.'.format(url));
    }

    var parsedUrl = {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            path: match[5] || '/',
            pathname: match[6] || '/',
            search: match[7] || '',
            hash: match[8] || '',
        },
        parameters = {}
    ;

    // Extract parameters.
    if (parsedUrl.search) {
        parameters = this.parseQuerystring(parsedUrl.search);
    }

    parsedUrl.parameters = parameters;

    return parsedUrl;
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.parseQuerystring = function(querystring) {
    if (/^\?/.test(querystring)) {
        querystring = querystring.slice(1);
    }

    var parameters = {},
        query = querystring.split('&')
    ;

    for (var i = 0; i < query.length; i++) {
        var field = query[i].split('='),
            key = decodeURIComponent(field[0]),
            value = field[1] ? decodeURIComponent(field[1]) : ''
        ;

        if ('' === key) {
            continue;
        }

        if (undefined === parameters[key]) {
            parameters[key] = value;
        } else if (Array.isArray(parameters[key])) {
            parameters[key].push(value);
        } else {
            parameters[key] = [parameters[key], value];
        }
    }

    return parameters;
}