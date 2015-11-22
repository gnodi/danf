'use strict';

module.exports = {
    // Define an interface.
    processor: {
        // Define the methods of the interface.
        methods: {
            // Define a method with its arguments and return value types.
            // '/value' is used for readability and debugging only.
            process: {
                arguments: ['number/value'],
                returns: 'number'
            }
        },
        // Define the getters of the interface.
        getters: {
            order: 'number'
        }
    }
};