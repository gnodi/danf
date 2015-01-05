'use strict';

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = require('danf/utils'),
        Abstract = require('danf/http/cookie/abstract-registry')
    ;

    /**
     * Initialize a new cookies registry.
     */
    function ClientRegistry() {
    }

    utils.extend(Abstract, ClientRegistry);

    /**
     * @interface {danf:http.cookiesRegistry}
     */
    ClientRegistry.prototype.get = function(key) {
        var regexp = new RegExp("(?:(?:^|.*;)\\s*{0}\\s*\\=\\s*([^;]*).*$)|^.*$".format(key));

        return document.cookie.replace(regexp, '$1') || null;
    }

    /**
     * @interface {danf:http.cookiesRegistry}
     */
    ClientRegistry.prototype.set = function(key, value, expiresAt, path, domain, isSecure, isHttpOnly) {
        document.cookie = '{0}={1}'.format(
            encodeURIComponent(key),
            this.formatCookieValue(value, expiresAt, path, domain, isSecure, isHttpOnly)
        );
    }

    /**
     * @interface {danf:http.cookiesRegistry}
     */
    ClientRegistry.prototype.unset = function(key, path, domain) {
        document.cookie = '{0}={1}'.format(
            encodeURIComponent(key),
            this.formatCookieValue('', new Date(0), path, domain)
        );
    }

    /**
     * Expose `ClientRegistry`.
     */
    return ClientRegistry;
});