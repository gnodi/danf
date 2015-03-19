'use strict';

module.exports = {
    referenceResolver: {
        methods: {
            /**
             * Extract an existing reference in a source.
             *
             * @param {string} source The string where the reference occurred.
             * @param {string} type The type of the reference.
             * @param {string|undefined} inText An optionnal text specifying where the reference is declared (errors).
             * @return {string_array|null} The existing reference or null.
             */
            extract: {
                arguments: [
                    'string/source',
                    'string/type',
                    'string|undefined/inText'
                ],
                returns: 'string_array|null'
            },
            /**
             * Resolve the references occurring in a source.
             *
             * Examples:
             *
             *     source = %foo.bar%
             *     type = '%'
             *     context = { foo: { bar: 'ok' } }
             *     => returns 'ok'
             *
             *     source = I love %who%
             *     type = '%'
             *     context = { who: 'you' }
             *     => returns 'I love you'
             *
             *     source = I love %who%
             *     type = '%'
             *     context = { who: ['you', 'me'] }
             *     => returns ['I love you', 'I love me']
             *
             *     source = %who%
             *     type = '%'
             *     context = {
             *         who: {
             *             you: 'Johna Doe',
             *             me: 'John Doe'
             *         }
             *     }
             *     => returns { you: 'Johna Doe', me: 'John Doe' }
             *
             *     source = I love %who%
             *     type = '%'
             *     context = {
             *         who: {
             *             you: 'Johna Doe',
             *             me: 'John Doe'
             *         }
             *     }
             *     => returns ['I love you', 'I love me']
             *
             *     source = '%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
             *     context = {
             *         who: [
             *             {
             *                 name: {
             *                     first: 'John',
             *                     last: 'Doe'
             *                 },
             *                 age: 25,
             *                 cities: ['Paris', 'New York']
             *             },
             *             {
             *                 name: {
             *                     first: 'Bobby',
             *                     last: 'Bob'
             *                 },
             *                 age: 28,
             *                 cities: ['Houston']
             *             },
             *         ]
             *     }
             *     => returns [
             *            'John Doe is 25 and lives in Paris',
             *            'John Doe is 25 and lives in New York',
             *            'Bobby Bob is 28 and lives in Houston'
             *        ]
             *
             * @param {string} source The string where the reference occurred.
             * @param {string} type The type of the reference.
             * @param {mixed} context The context allowing to resolve the reference.
             * @param {string|undefined} inText An optionnal text specifying where the reference is declared (errors).
             * @return {mixed} The resolved references.
             */
            resolve: {
                arguments: [
                    'string/source',
                    'string/type',
                    'mixed/context',
                    'string|undefined/inText'
                ],
                returns: 'mixed'
            }
        }
    },
    referenceType: {
        getters: {
            /**
             * The unique name of the type.
             *
             * @return {string} The name.
             */
            name: 'string',
            /**
             * The delimiter for the reference.
             *
             * @return {string} The delimiter.
             */
            delimiter: 'string',
            /**
             * The size of the reference.
             *
             * if size = 1 & delimiter = % => %ref%
             * if size = 4 & delimiter = > => >ref>is>like>that>
             *
             * @return {number} The size.
             */
            size: 'number',
            /**
             * The indexes of the reference which should be namespaced when asked.
             *
             * if size = 4 & delimiter = > & namespaces = [0, 2] => >prefix:ref>is>prefix:like>that>
             *
             * @return {number_array} The namespaced indexes.
             */
            namespaces: 'number_array',
            /**
             * Whether or not the type allow the concatenation.
             *
             * @return {boolean} True if the concatenation is allowed, false otherwise.
             */
            allowsConcatenation: 'boolean'
        }
    },
    dataResolver: {
        methods: {
            /**
             * Merge two data from a contract.
             *
             * @param {mixed} data1 The first data.
             * @param {mixed} data2 The second data.
             * @param {object} contract The contract the data should respect.
             * @param {object} erase Should erase data1 with data2 if conflict?
             * @param {string} namespace The namespace of the data.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @param {boolean} formatsContract Whether or not to format the contract.
             * @return {mixed} The merged data.
             */
            merge: {
                arguments: [
                    'mixed/data1',
                    'mixed/data2',
                    'object/contract',
                    'boolean|undefined/erase',
                    'string|undefined/namespace',
                    'object|undefined/parameters',
                    'boolean|undefined/formatsContract'
                ],
                returns: 'mixed'
            },
            /**
             * Resolve a data from a contract.
             *
             * @param {mixed} data The data.
             * @param {object} contract The contract the data should respect.
             * @param {string} namespace The optional namespace.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @param {boolean} formatsContract Whether or not to format the contract.
             * @return {mixed} The resolved data.
             */
            resolve: {
                arguments: [
                    'mixed/data',
                    'object/contract',
                    'string|undefined/namespace',
                    'object|undefined/parameters',
                    'boolean|undefined/formatsContract'
                ],
                returns: 'mixed'
            }
        }
    },
    dataInterpreter: {
        methods: {
            /**
             * Format a contract.
             *
             * @param {object} contract The contract.
             * @return {object} The formatted contract.
             */
            formatContract: {
                arguments: ['object/contract'],
                returns: 'object'
            },
            /**
             * Merge two data from a contract.
             *
             * @param {string} name The name of the data.
             * @param {mixed} value The passed value between data interpreters.
             * @param {mixed} data1 The first data.
             * @param {mixed} data2 The second data.
             * @param {object} contract The contract the data should respect.
             * @param {object} erase Should erase data1 with data2 if conflict?
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @return {mixed} The resolved data.
             */
            merge: {
                arguments: [
                    'string/name',
                    'mixed/value',
                    'mixed/data1',
                    'mixed/data2',
                    'object/contract',
                    'boolean|undefined/erase',
                    'object|undefined/parameters'
                ],
                returns: 'mixed'
            },
            /**
             * Interpret a value from a contract.
             *
             * @param {string} name The name of the data.
             * @param {mixed} value The value.
             * @param {object} contract The contract the data should respect.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @return {mixed} The interpreted value.
             */
            interpret: {
                arguments: [
                    'string/name',
                    'mixed/value',
                    'object/contract',
                    'object|undefined/parameters'
                ],
                returns: 'mixed'
            }
        },
        getters: {
            /**
             * The order of execution.
             *
             * @return {number} The order.
             */
            order: 'number'
        },
        setters: {
            /**
             * The data resolver.
             *
             * @param {danf:manipulation.dataResolver} The data resolver.
             */
            dataResolver: 'danf:manipulation.dataResolver'
        }
    },
    sequencer: {
        methods: {
            /**
             * Add a callback in the sequence to proceed.
             *
             * @param {danf:manipulation.sequencer|function} callback The callback or sub-sequencer.
             * @param {string} scope The optional scope of the stream for the callback.
             */
            pipe: {
                arguments: ['danf:manipulation.sequencer|function/callback', 'string|undefined/scope']
            },
            /**
             * Add a callback to proceed on each call to set the global context for each stream.
             *
             * @param {function} callback The callback.
             */
            addGlobalContext: {
                arguments: ['function/callback']
            },
            /**
             * Start to proceed a new stream.
             *
             * @param {mixed} stream The stream.
             * @param {function|undefined|null} callback The callback to call after the processing of the stream.
             * @param {function|undefined|null} context A callback to proceed on each call to set the context for this particular stream.
             */
            start: {
                arguments: ['mixed/stream', 'function|undefined|null/callback', 'function|undefined|null/context']
            },
            /**
             * Ask the sequencer to wait for an asynchrone task to finish.
             *
             * @return {number} The identifier of the task.
             */
            wait: {
                returns: 'number'
            },
            /**
             * Tell the sequencer that an asynchrone task has ended.
             *
             * @param {number} task The identifier of the task.
             * @param {function|undefined} callback The optional callback to call after the end of the task allowing to impact the stream.
             */
            end: {
                arguments: ['number/task', 'function|undefined/callback']
            }
        },
        getters: {
            /**
             * The sequencer stack.
             *
             * @return {danf:manipulation.sequencerStack} The sequencer stack.
             */
            sequencerStack: 'danf:manipulation.sequencerStack',
            /**
             * The stream context.
             *
             * @return {object_array} The stream context.
             */
            streamContext: 'object_array',
            /**
             * The global context.
             *
             * @return {function_array} The global context.
             */
            globalContext: 'function_array'
        },
        setters: {
            /**
             * The sequencer stack.
             *
             * @param {danf:manipulation.sequencerStack} The sequencer stack.
             */
            sequencerStack: 'danf:manipulation.sequencerStack'
        }
    },
    sequencerStack: {
        methods: {
            /**
             * Add a sequencer on the stack.
             *
             * @param {danf:manipulation.sequencer} sequencer The sequencer.
             */
            push: {
                arguments: ['danf:manipulation.sequencer/sequencer']
            },
            /**
             * Free a sequencer in the stack.
             *
             * @param {danf:manipulation.sequencer} sequencer The sequencer.
             */
            free: {
                arguments: ['danf:manipulation.sequencer/sequencer']
            },
            /**
             * Retrieve the list of global contexts.
             *
             * @return {function_array_array} The global contexts.
             */
            retrieveGlobalContexts: {
                returns: 'array'
            },
            /**
             * Retrieve the list of stream contexts.
             *
             * @return {function_array} The stream contexts.
             */
            retrieveStreamContexts: {
                returns: 'array'
            }
        }
    },
    registry: {
        methods: {
            /**
             * Register an item.
             *
             * @param {string} name The identifier name of the item.
             * @param {mixed} item The item.
             */
            register: {
                arguments: ['string/name', 'mixed/item']
            },
            /**
             * Register a list of items.
             *
             * @param {mixed_object} items The list of items.
             */
            registerSet: {
                arguments: ['mixed_object/items']
            },
            /**
             * Deregister an item.
             *
             * @param {string} name The identifier name of the item.
             */
            deregister: {
                arguments: ['string/name']
            },
            /**
             * Deregister all items.
             */
            deregisterAll: {
                arguments: []
            },
            /**
             * Whether or not the item has been registered.
             *
             * @param {string} name The identifier name of the item.
             * @return {boolean} True if the item has been registered, false otherwise.
             */
            has: {
                arguments: ['string/name'],
                returns: 'boolean'
            },
            /**
             * Get a registered item from its name.
             *
             * @param {string} name The identifier name of the item.
             * @return {mixed} The item.
             * @throw {error} If the item is not registered.
             */
            get: {
                arguments: ['string/name'],
                returns: 'mixed'
            },
            /**
             * Get all the items.
             *
             * @return {object} The items.
             */
            getAll: {
                returns: 'object'
            }
        }
    },
    notifierRegistry: {
        extends: 'danf:manipulation.registry',
        methods: {
            /**
             * Add an observer notified on each change.
             *
             * @param {danf:manipulation.registryObserver} observer The observer.
             */
            addObserver: {
                arguments: ['danf:manipulation.registryObserver/observer']
            },
            /**
             * Remove an observer.
             *
             * @param {danf:manipulation.registryObserver} observer The observer.
             */
            removeObserver: {
                arguments: ['danf:manipulation.registryObserver/observer']
            },
            /**
             * Remove all observers.
             */
            removeAllObservers: {
                arguments: []
            }
        }
    },
    registryObserver: {
        methods: {
            /**
             * Handle a change coming from a registry.
             *
             * @param {mixed_object} items The items.
             * @param {boolean} reset Whether or not it is a reset.
             * @param {string} name The name of the registry.
             */
            handleRegistryChange: {
                arguments: [
                    'mixed_object/items',
                    'boolean/reset',
                    'string/name'
                ]
            }
        }
    },
    callbackExecutor: {
        methods: {
            /**
             * Execute a callback.
             *
             * @param {function} callback The callback.
             * @param {mixed} paramN The N-th argument to pass to the callback.
             * @return {mixed} The return of the callback.
             */
            execute: {
                arguments: [
                    'function/callback',
                    'arg0/mixed',
                    'arg1/mixed',
                    'arg2/mixed',
                    'arg3/mixed',
                    'arg4/mixed',
                    'arg5/mixed',
                    'arg6/mixed',
                    'arg7/mixed',
                    'arg8/mixed',
                    'arg9/mixed'
                ]
            }
        }
    }
};