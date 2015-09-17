'use strict';

module.exports = {
    route: {
        methods: {
            /**
             * Match a path and a HTTP method.
             *
             * @param {string} path The path.
             * @param {string} method The HTTP method.
             * @return {boolean} True if the route match, false otherwise.
             */
            match: {
                arguments: [
                    'string/path',
                    'string|null/method',
                    'object|null/data'
                ]
            },
            /**
             * Follow a route.
             *
             * @param {object|null} data The route event trigger data.
             */
            follow: {
                arguments: ['object|null/data']
            }
        },
        getters: {
            /**
             * The path.
             *
             * @return {string}
             */
            path: 'string',
            /**
             * The HTTP method.
             *
             * @return {string}
             */
            method: 'string',
            /**
             * The associated request event.
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
             * Find a route from a url/path and a HTTP method.
             *
             * @param {string} url The url or path.
             * @param {string|null} method The HTTP method, default GET.
             * @param {boolean|null} throwException Whether or not to throw an exception if no route found, default false.
             * @return {danf:http.route|null} The route or null if no route found and throwException is false.
             * @throw {error} if the route does not exist and throwException is true.
             */
            find: {
                arguments: [
                    'string/url',
                    'string|null/method',
                    'boolean|null/throwException'
                ]
            },
            /**
             * Follow a route from a url/path and a HTTP method.
             *
             * @param {string} url The url or path.
             * @param {string|null} method The HTTP method, default GET.
             * @param {object|null} data The route event trigger data.
             * @throw {error} if the route does not exist.
             */
            follow: {
                arguments: [
                    'string/url',
                    'string|null/method',
                    'object|null/data'
                ]
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