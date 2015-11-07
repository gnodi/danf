'use strict';

module.exports = {
    // Define a sequence.
    simple: {
        // Check input stream.
        // The input stream is an object with a property 'value'
        // and a property 'timeout'.
        stream: {
            value: {
                type: 'number',
                required: true
            },
            timeout: {
                type: 'number',
                default: 10
            }
        },
        // Define the processed operations.
        operations: [
            // Define an operation which is a call to a method
            // of a service with some arguments.
            // '@value@' and '@timeout@' are references resolved from the stream.
            // The scope is the property which will be impacted by
            // the (synchronous or asynchronous!) return of the method.
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', '@timeout@'],
                scope: 'value'
            }
        ]
    },
    unpredictable: {
        operations: [
            {
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: [6, 10],
                scope: 'value'
            }
        ]
    },
    parallel: {
        operations: [
            // Use 2 different scopes.
            {
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value1'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: [6, 10],
                scope: 'value2'
            }
        ]
    },
    series: {
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            // By default, order is set to 0.
            {
                order: 0,
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value'
            },
            {
                order: 1,
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', 10],
                scope: 'value'
            }
        ]
    },
    collection: {
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            {
                service: 'computer',
                method: 'compute',
                // Define the arguments for each item.
                // '@@.@@' is a reference resolved in the context of
                // the collection item.
                arguments: ['@@.@@'],
                scope: 'value',
                // Define processing on a collection.
                collection: {
                    // Define the input collection.
                    input: [2, 3, 4],
                    // Define the async method used.
                    method: '||'
                }
            }
        ]
    }
};