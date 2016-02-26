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
             * @param {number|null} length The max string length to display, default all.
             */
            log: {
                arguments: [
                    'mixed/value',
                    'number/verbosity',
                    'number|null/indentation',
                    'number|null/length'
                ]
            }
        }
    }
};