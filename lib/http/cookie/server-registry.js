'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract-registry')
;

/**
 * Expose `ServerRegistry`.
 */
module.exports = ServerRegistry;

/**
 * Initialize a new cookies registry.
 *
 * @param {danf:dependencyInjection.contextProvider<object>} requestProvider The request provider.
 */
function ServerRegistry(requestProvider) {
    if (requestProvider) {
        this.requestProvider = requestProvider;
    }
}

utils.extend(Abstract, ServerRegistry);

ServerRegistry.defineDependency('_requestProvider', 'danf:dependencyInjection.contextProvider', 'object');
ServerRegistry.defineDependency('_responseProvider', 'danf:dependencyInjection.contextProvider', 'object');

/**
 * Set the request provider.
 *
 * @param {danf:manipulation.contextProvider<object>}
 * @api public
 */
Object.defineProperty(ServerRegistry.prototype, 'requestProvider', {
    set: function(requestProvider) { this._requestProvider = requestProvider; }
});

/**
 * Set the response provider.
 *
 * @param {danf:manipulation.contextProvider<object>}
 * @api public
 */
Object.defineProperty(ServerRegistry.prototype, 'responseProvider', {
    set: function(responseProvider) { this._responseProvider = responseProvider; }
});

/**
 * @interface {danf:http.cookiesRegistry}
 */
ServerRegistry.prototype.get = function(key) {
    var cookies = getCookies.call(this),
        formattedKey = encodeURIComponent(key)
    ;

    return cookies[formattedKey];
}

/**
 * @interface {danf:http.cookiesRegistry}
 */
ServerRegistry.prototype.set = function(key, value, expiresAt, path, domain, isSecure, isHttpOnly) {
    var cookies = getCookies.call(this),
        response = this._responseProvider.provide(),
        formattedKey = encodeURIComponent(key),
        formattedValue = encodeURIComponent(value)
    ;

    cookies[formattedKey] = formattedValue;

    response.cookie(
        formattedKey,
        formattedValue,
        {
            expires: expiresAt,
            path: path,
            domain: domain,
            secure: isSecure,
            httpOnly: isHttpOnly
        }
    );
}

/**
 * @interface {danf:http.cookiesRegistry}
 */
ServerRegistry.prototype.unset = function(key, path, domain) {
    var cookies = getCookies.call(this),
        response = this._responseProvider.provide(),
        formattedKey = encodeURIComponent(key)
    ;

    delete cookies[formattedKey];

    response.cookie(
        formattedKey,
        '',
        {
            expires: new Date(0),
            path: path,
            domain: domain
        }
    );
}

/**
 * Get the cookies.
 *
 * @return {object} The cookies.
 * @api private
 */
var getCookies = function() {
    var request = this._requestProvider.provide();

    if (undefined === request.cookies) {
        throw new Error('There is no accessible cookies.');
    }

    return request.cookies;
}