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
        ],
        // Link the sequence to some collections.
        collections: ['computing']
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
        ],
        collections: ['computing']
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
        ],
        collections: ['computing']
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
        ],
        collections: ['computing']
    },
    collection: {
        operations: [
            {
                service: 'computer',
                method: 'compute',
                // Define the arguments for each item.
                // '@@.@@' is a reference resolved in the context of
                // the collection item.
                // Here the collection items are 2, 3 and 4.
                // @@.@@ will resolve in 2, 3 and 4.
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
        ],
        collections: ['computing']
    },
    log: {
        operations: [
            {
                condition: function(stream, context) {
                    return undefined !== stream.value;
                },
                // Use the danf logger to log input and output.
                service: 'danf:logging.logger',
                method: 'log',
                // Define the string to log. Some references can be
                // resolved inside a string.
                arguments: ['<<blue>>@text@: <<bold>>@value@']
            }
        ],
        // Add operations on sequences belonging to the collection
        // 'computing'.
        parents: [
            {
                // Define the order relatively to the parent sequence.
                order: -10,
                // Define the target as the collection 'computing'.
                target: '&computing&',
                // Define the input of the sequence in the context of
                // the parent sequence stream.
                input: {
                    value: '@value@',
                    text: 'input'
                }
            },
            {
                order: 10,
                target: '&computing&',
                input: {
                    value: '@value@',
                    text: 'output'
                }
            }
        ]
    },
    compute: {
        children: [
            {
                order: 0,
                name: 'simple',
                input: {
                    value: 2
                }
            },
            {
                order: 1,
                name: 'unpredictable'
            },
            {
                order: 2,
                name: 'parallel'
            },
            {
                order: 3,
                name: 'series'
            },
            {
                order: 4,
                name: 'collection'
            }
        ]
    }
};