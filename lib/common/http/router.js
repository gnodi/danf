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

Router.defineDependency('_routes', 'danf:http.route_object');

/**
 * Set the ajax processors.
 *
 * @param {danf:ajaxApp.processor_array}
 * @api public
 */
Object.defineProperty(Router.prototype, 'routeProvider', {
    set: function(routeProvider) { this._routeProvider = routeProvider; }
});

/**
 * @interface {danf:manipulation.registryObserver}
 */
Router.prototype.handleRegistryChange = function(items, reset, name) {
    if (items['request']) {
        for (var id in items['request']) {
            if (!reset) {
                var request = items['request'][id],
                    route = this._routeProvider.provide({
                        path: request.path,
                        method: request.method,
                        event: this._eventsContainer.get('request', id)
                    })
                ;

                this.setRoute(id, route);
            } else {
                this.removeRoute(id);
            }
        }
    }
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.setRoute = function(name, route) {
    if (this._routes[name]) {
        this.removeRoute(name);
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
Router.prototype.removeRoute = function(name) {
    delete this._routes[name];

    for (var method in this._methodRoutes) {
        delete this._methodRoutes[method][name];
    }
}

/**
 * @interface {danf:http.router}
 */
Router.prototype.find = function(url, method, throwException) {
    var absolute = /^http[s]?:\/\//i.test(url),
        method = method ? method : 'GET',
        path = absolute
            ? /^http[s]?:\/\/[^\/]+(\/[^?#]*)/i.match(url)[1]
            : url
    ;

    if (!/^\//.test(path)) {
        path = '/' + path;
    }

    // Take the first matching route.
    var routes = this._methodRoutes[method];

    for (var name in routes) {
        if (routes[name].match(path, method)) {
            return routes[name];
        }
    }

    if (throwException) {
        throw new Error('No route for [{0}]"{1}" found.'.format(method, path));
    }

    return null;
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