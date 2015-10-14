'use strict';

module.exports = {
    route: {
        methods: {
            /**
             * Match a path, a HTTP method and a host.
             *
             * @param {string} path The path.
             * @param {string} method The HTTP method.
             * @param {string|null} host The host, default localhost.
             * @return {boolean} True if the route match, false otherwise.
             */
            match: {
                arguments: [
                    'string/path',
                    'string/method',
                    'string|null/host'
                ],
                returns: 'boolean'
            },
            /**
             * Resolve a path from parameters.
             *
             * @param {object|string} parameters The parameters.
             * @return {string} The resolved path.
             * @throw {error} if there is a missing parameter.
             */
            resolve: {
                arguments: ['object|string/parameters'],
                returns: 'string'
            },
            /**
             * Follow a route.
             *
             * @param {object|null} parameters The request parameters.
             * @param {object|null} headers The request headers.
             * @param {object|null} meta The request metadata (path, protocol, host, ...).
             * @throw {error} if the url doest not match the route.
             */
            follow: {
                arguments: [
                    'object|string|null/parameters',
                    'object|null/headers',
                    'object|null/meta'
                ]
            }
        },
        getters: {
            /**
             * Path.
             *
             * @return {string}
             */
            path: 'string',
            /**
             * HTTP method.
             *
             * @return {string}
             */
            method: 'string',
            /**
             * Associated request event.
             *
             * @return {danf:event.event}
             */
            event: 'danf:event.event'
        }
    },
    router: {
        methods: {
            /**
             * Get a route.
             *
             * @param {string} name The identifier name of the route.
             * @return {danf:http.route} The route.
             * @throw {error} if the route does not exist.
             */
            get: {
                arguments: ['string/name'],
                returns: 'mixed'
            },
            /**
             * Set a route.
             *
             * @param {string} name The identifier name of the route.
             * @param {danf:http.route} route The route.
             */
            set: {
                arguments: [
                    'string/name',
                    'danf:http.route/route'
                ]
            },
            /**
             * Unset a route.
             *
             * @param {string} name The identifier name of the route.
             */
            unset: {
                arguments: [
                    'string/key',
                    'string|null/path',
                    'string|null/domain'
                ]
            },
            /**
             * Find a route from a URL/path and a HTTP method.
             *
             * @param {string|object} url The path/URL string or parsed.
             * @param {string|null} method The HTTP method.
             * @param {boolean|null} throwException Whether or not to throw an exception if no route found, default false.
             * @return {danf:http.route|null} The route or null if no route found and throwException is false.
             * @throw {error} if the route does not exist and throwException is true.
             */
            find: {
                arguments: [
                    'string|object/url',
                    'string|null/method',
                    'boolean|null/throwException'
                ],
                returns: 'danf:http.route|null'
            },
            /**
             * Follow a route from a URL/path and a HTTP method.
             *
             * @param {string} url The URL or path.
             * @param {string|null} method The HTTP method.
             * @param {object|null} parameters The request parameters.
             * @param {object|null} parameters The request headers.
             * @throw {error} if the route does not exist.
             */
            follow: {
                arguments: [
                    'string/url',
                    'string/method',
                    'object|null/parameters',
                    'object|null/headers'
                ]
            },
            /**
             * Parse an url.
             *
             * @param {string} url The URL.
             * @return {object} The parsed URL.
             * @throw {error} if the URL is not well formatted.
             */
            parse: {
                arguments: ['string/url'],
                returns: 'object'
            },
            /**
             * Parse a querystring.
             *
             * @param {string} querystring The querystring.
             * @return {object} The parsed parameters.
             */
            parseQuerystring: {
                arguments: ['string/querystring'],
                returns: 'object'
            }
        }
    },
    cookiesRegistry: {
        methods: {
            /**
             * Get a cookie.
             *
             * @param {string} key The key.
             * @return {mixed} The value.
             */
            get: {
                arguments: ['string/key'],
                returns: 'mixed'
            },
            /**
             * Set a cookie.
             *
             * @param {string} key The key.
             * @param {string} value The value.
             * @param {date|null} expiresAt The date of expiration.
             * @param {string|null} path The optional path.
             * @param {string|null} domain The optional domain.
             * @param {boolean|null} isSecure Whether or not this is a secure cookie.
             * @param {boolean|null} isHttpOnly Whether or not this is a http only cookie.
             */
            set: {
                arguments: [
                    'string/key',
                    'mixed/value',
                    'date|null/expiresAt',
                    'string|null/path',
                    'string|null/domain',
                    'boolean|null/isSecure',
                    'boolean|null/isHttpOnly'
                ]
            },
            /**
             * Unset a cookie.
             *
             * @param {string} key The key.
             * @param {string|null} path The optional path.
             * @param {string|null} domain The optional domain.
             */
            unset: {
                arguments: [
                    'string/key',
                    'string|null/path',
                    'string|null/domain'
                ]
            }
        }
    }
};