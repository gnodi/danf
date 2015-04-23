'use strict';

module.exports = {
    benchmarker: {
        methods: {
            /**
             * Start a measure.
             *
             * @param {string} measure The id of the measure.
             */
            start: {
                arguments: ['string/measure']
            },
            /**
             * End a measure and display the result in the console.
             *
             * @param {string} measure The id of the measure.
             */
            end: {
                arguments: ['string/measure']
            }
        }
    }
};