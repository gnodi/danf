'use strict';

module.exports = {
    logger: {
        methods: {
            /**
             * Log a value.
             *
             * @param {mixed} value The value.
             * @param {number} verbosity The verbosity level.
             * @param {number|null} indentation The optional indentation level.
             */
            log: {
                arguments: [
                    'mixed/value',
                    'number/verbosity',
                    'number|null/indentation'
                ]
            }
        }
    }
};