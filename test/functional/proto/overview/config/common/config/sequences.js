'use strict';

module.exports = {
    // Define a sequence.
    simple: {
        // Check input stream.
        // The input stream is an object with a property 'value',
        // a property 'timeout' and a property 'name'.
        // Not defining this will result in a free stream input.
        stream: {
            value: {
                type: 'number',
                required: true
            },
            timeout: {
                type: 'number',
                default: 10
            },
            name: {
                type: 'string',
                required: true
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
        collections: ['computation']
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
                arguments: [3, 10],
                scope: 'value'
            }
        ],
        collections: ['computation']
    },
    parallel: {
        stream: {
            value1: {
                type: 'number',
                default: 2
            },
            value2: {
                type: 'number',
                default: 3
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            // Use 2 different scopes.
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value1@', 10],
                scope: 'value1'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value2@', 10],
                scope: 'value2'
            }
        ],
        collections: ['computation']
    },
    series: {
        stream: {
            value: {
                type: 'number',
                default: 2
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            // By default, order is set to 0.
            {
                order: 0,
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', 10],
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
        collections: ['computation']
    },
    collection: {
        stream: {
            value: {
                type: 'number_array',
                default: [2, 3, 4]
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            {
                service: 'computer',
                method: 'compute',
                // Define the arguments for each item.
                // '@@.@@' is a reference resolved in the context of
                // the collection item.
                // Taking the default value of stream property 'value',
                // the collection items are 2, 3 and 4.
                // @@.@@ will resolve in 2, 3 and 4.
                arguments: ['@@.@@'],
                scope: 'value',
                // Define processing on a collection.
                collection: {
                    // Define the input collection.
                    input: '@value@',
                    // Define the async method used.
                    method: '||'
                }
            }
        ],
        collections: ['computation']
    },
    log: {
        operations: [
            {
                // Define sequence internal order.
                order: 0,
                // Use the danf callback executor (only use it for test)
                // to set a stringified stream.
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(stream) {
                        var valueStream = {};

                        for (var key in stream) {
                            if (0 === key.indexOf('value')) {
                                valueStream[key] = stream[key];
                            }
                        }

                        return JSON.stringify(valueStream);
                    },
                    '@stream@'
                ],
                scope: 'stream'
            },
            {
                order: 1,
                // Use the danf logger to log input and output.
                service: 'danf:logging.logger',
                method: 'log',
                // Define the string to log. Some references can be
                // resolved inside a string.
                arguments: ['<<@color@>>@name@ @text@: <<bold>>@stream@']
            }
        ],
        // Add operations on sequences belonging to the collection
        // 'computation'.
        parents: [
            {
                // Define the order relatively to the parent sequence.
                order: -10,
                // Define the target as the collection 'computation'.
                target: '&computation&',
                // Define the input of the sequence in the context of
                // the parent sequence stream.
                input: {
                    stream: '@.@',
                    text: 'input',
                    color: 'magenta',
                    name: '@name@'
                }
            },
            {
                order: 10,
                target: '&computation&',
                input: {
                    stream: '@.@',
                    text: 'output',
                    color: 'blue',
                    name: '@name@'
                }
            }
        ]
    },
    compute: {
        // Add operations to the list of operations of this sequence.
        // Here the sequence has no own operations.
        children: [
            {
                // Define the order relatively to this sequence.
                order: 0,
                // Define the name of the child sequence.
                name: 'simple',
                input: {
                    value: 2,
                    name: 'simple'
                },
                output: {
                    simple: '@.@'
                }
            },
            {
                order: 0,
                name: 'unpredictable',
                input: {
                    name: 'unpredictable'
                },
                output: {
                    unpredictable: '@.@'
                }
            },
            {
                order: 0,
                name: 'parallel',
                input: {
                    name: 'parallel'
                },
                output: {
                    parallel: '@.@'
                }
            },
            {
                order: 0,
                name: 'series',
                input: {
                    name: 'series'
                },
                output: {
                    series: '@.@'
                }
            },
            {
                order: 0,
                name: 'collection',
                input: {
                    name: 'collection'
                },
                output: {
                    collection: '@.@'
                }
            }
        ]
    }
};