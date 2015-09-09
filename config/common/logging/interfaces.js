'use strict';

module.exports = {
    logger: {
        methods: {
            /**
             * Log a message.
             *
             * @param {string} message The message.
             * @param {number} verbosity The verbosity level.
             * @param {number|null} indentation The optional indentation level.
             */
            log: {
                arguments: [
                    'string/message',
                    'number/verbosity',
                    'number|null/indentation'
                ]
            }
        }
    }
};