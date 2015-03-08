'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
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
                        'value/mixed',
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
});