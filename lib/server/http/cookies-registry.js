'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../common/utils'),
    Abstract = require('../../common/http/abstract-cookies-registry')
;

/**
 * Expose `CookiesRegistry`.
 */
module.exports = CookiesRegistry;

/**
 * Initialize a new cookies registry.
 */
function CookiesRegistry() {
}

utils.extend(Abstract, CookiesRegistry);

CookiesRegistry.defineDependency('_flowContext', 'danf:sequencing.flowContext');

/**
 * Flow context.
 *
 * @var {danf:sequencing.flowContext}
 * @api public
 */
Object.defineProperty(CookiesRegistry.prototype, 'flowContext', {
    set: function(flowContext) { this._flowContext = flowContext; }
});

/**
 * @interface {danf:http.cookiesRegistry}
 */
CookiesRegistry.prototype.get = function(key) {
    var cookies = getCookies.call(this),
        formattedKey = encodeURIComponent(key)
    ;

    return cookies[formattedKey];
}

/**
 * @interface {danf:http.cookiesRegistry}
 */
CookiesRegistry.prototype.set = function(key, value, expiresAt, path, domain, isSecure, isHttpOnly) {
    var cookies = getCookies.call(this),
        response = this._flowContext.get('response'),
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
CookiesRegistry.prototype.unset = function(key, path, domain) {
    var cookies = getCookies.call(this),
        response = this._flowContext.get('response'),
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
    var request = this._flowContext.get('request');

    if (undefined === request.cookies) {
        throw new Error('There is no accessible cookies.');
    }

    return request.cookies;
}