'use strict';

module.exports = {
    errorHandler: {
        methods: {
            /**
             * Process an HTTP error.
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
                arguments: ['string/key', 'value/mixed']
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