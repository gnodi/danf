'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new cookies registry.
     */
    function AbstractRegistry() {
    }

    AbstractRegistry.defineImplementedInterfaces(['danf:http.cookiesRegistry']);

    /**
     * Format a cookie value.
     *
     * @param {string} value The value.
     * @param {date|null} expireAt The date of expiration.
     * @param {string|null} path The optional path.
     * @param {string|null} domain The optional domain.
     * @param {boolean|null} isSecure Whether or not this is a secure cookie.
     * @param {boolean|null} isHttpOnly Whether or not this is a http only cookie.
     * @return {string} The formatted value.
     * @api protected
     */
    AbstractRegistry.prototype.formatCookieValue = function(value, expireAt, path, domain, isSecure, isHttpOnly) {
        return '{0}{1}{2}{3}{4}{5}'.format(
            encodeURIComponent(value),
            expireAt ? '; expires={0}'.format(expireAt.toUTCString()) : '',
            path ?  '; path={0}'.format(path) : '',
            domain ?  '; domain={0}'.format(domain) : '',
            isSecure ?  '; secure' : '',
            isHttpOnly ?  '; httpOnly' : ''
        );
    }

    /**
     * Expose `AbstractRegistry`.
     */
    return AbstractRegistry;
});