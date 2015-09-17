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
    var absolute = /^http[s]?:\/\//i.test(url),
        method = method ? method.toUpperCase() : 'GET',
        path = absolute
            ? /^http[s]?:\/\/[^\/]+(\/[^?#]*)/i.exec(url)[1]
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
Router.prototype.follow = function(url, method, data) {
    this.find(url, method, true).follow(data);
}