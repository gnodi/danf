'use strict';

module.exports = {
    request: {},
    response: {},
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
    }
};