'use strict';

module.exports = {
    errorHandler: {
        methods: {
            /**
             * Process a HTTP error.
             *
             * @param {error} error The error.
             * @return {error} The processed error.
             */
            process: {
                arguments: ['error/error'],
                returns: 'error'
            }
        }
    },
    redirector: {
        methods: {
            /**
             * Redirect a HTTP request.
             *
             * @param {string} url The URL/path of the redirect.
             * @param {number|null} status The optional redirect HTTP status code, default 302.
             */
            redirect: {
                arguments: ['string/url', 'number|null/status']
            }
        }
    },
    sessionHandler: {
        methods: {
            /**
             * Get a value in the session.
             *
             * @param {string} key The key.
             * @return {mixed} The value.
             */
            get: {
                arguments: ['string/key'],
                returns: 'mixed'
            },
            /**
             * Set a value in the session.
             *
             * @param {string} key The key.
             * @param {mixed} value The value.
             */
            set: {
                arguments: ['string/key', 'mixed/value']
            },
            /**
             * Regenerate the session.
             */
            regenerate: {
                arguments: []
            },
            /**
             * Destroy the session.
             */
            destroy: {
                arguments: []
            },
            /**
             * Reload the session.
             */
            reload: {
                arguments: []
            },
            /**
             * Save the session.
             */
            save: {
                arguments: []
            },
            /**
             * Update the max age of the session.
             */
            touch: {
                arguments: []
            }
        }
    }
};