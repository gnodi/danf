'use strict';

module.exports = {
    notifier: {
        methods: {
            /**
             * Add an event listener.
             *
             * @param {danf:event.event} event The event.
             */
            addListener: {
                arguments: ['danf:event.event/event']
            },
            /**
             * Notify an event triggering.
             *
             * @param {danf:event.event} event The event.
             * @param {mixed} data The data associated with the triggered event.
             */
            notify: {
                arguments: ['danf:event.event/event', 'mixed/data']
            }
        },
        getters: {
            /**
             * The identifier name of the notifier.
             *
             * @return {string} The name.
             */
            name: 'string',
            /**
             * The contract that an event should respect in the configuration.
             *
             * @return {object} The contract.
             */
            contract: 'object'
        }
    },
    referencesResolver: {
        methods: {
            /**
             * Resolve references.
             *
             * @param {mixed} source The source of references.
             * @param {mixed} context The resolving context.
             * @param {string|null} inText An optionnal text specifying where the reference is declared (errors).
             * @return {mixed} The resolved references.
             */
            resolve: {
                arguments: [
                    'mixed/source',
                    'mixed/context',
                    'string|null/inText'
                ],
                returns: 'mixed'
            },
            /**
             * Resolve references of a specific type.
             *
             * @param {string} source The source of references.
             * @param {string} type The identifier of a reference type.
             * @param {mixed} context The resolving context.
             * @param {string|null} inText An optionnal text specifying where the reference is declared (errors).
             * @return {mixed} The resolved references.
             */
            resolveSpecific: {
                arguments: [
                    'string/source',
                    'string/type',
                    'mixed/context',
                    'string|null/inText'
                ],
                returns: 'mixed'
            }
        }
    },
    sequence: {
        methods: {
            /**
             * Execute the sequence.
             *
             * @param {object} input The input of the sequence.
             * @param {object} context The context of execution.
             * @param {string} scope The scope of execution in the stream.
             * @param {function|null} callback The optional callback.
             */
            execute: {
                arguments: [
                    'object/input',
                    'object/context',
                    'string/scope',
                    'function|null/callback'
                ]
            },
            /**
             * Execute the sequence from a forwarded execution.
             *
             * @param {danf:manipulation.flow} flow The current flow of execution.
             * @param {function|null} callback The optional callback.
             */
            forward: {
                arguments: [
                    'danf:manipulation.flow/flow',
                    'function|null/callback'
                ]
            }
        }
    },
    event: {
        methods: {
            /**
             * Trigger the execution of the event.
             *
             * @param {object|null} data The optional data related to the event.
             */
            trigger: {
                arguments: ['object|null/data']
            }
        },
        getters: {
            /**
             * The identifier name.
             *
             * @return {danf:event.notifier} The name.
             */
            name: 'string',
            /**
             * The parameters.
             *
             * @return {object} The parameters.
             */
            parameters: 'object',
            /**
             * The sequence.
             *
             * @return {danf:event.sequence} The sequence.
             */
            sequence: 'danf:event.sequence'
        },
        setters: {
            /**
             * The notifier.
             *
             * @return {danf:event.notifier} The notifier.
             */
            notifier: 'danf:event.notifier'
        }

    },
    sequencesContainer: {
        methods: {
            /**
             * Set an alias to a service.
             *
             * @param {string} alias The alias.
             * @param {string} id The id of the service.
             */
            setAlias: {
                arguments: ['string/alias', 'string/id']
            },
            /**
             * Set the definition of a service.
             *
             * @param {string} id The id of the service.
             * @param {object} definition The definition.
             */
            setDefinition: {
                arguments: ['string/id', 'object/definition']
            },
            /**
             * Get the definition of a service.
             *
             * @param {string} id The id of the service.
             * @return {object} The definition.
             */
            getDefinition: {
                arguments: ['string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a service is defined.
             *
             * @param {string} id The id of the service.
             * @return {boolean} True if the service is defined, false otherwise.
             */
            hasDefinition: {
                arguments: ['string/id'],
                returns: 'boolean'
            },
            /**
             * Get the interpretation of a service.
             *
             * @param {string} id The id of the service.
             * @return {object} The interpretation.
             */
            getInterpretation: {
                arguments: ['string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a service is interpreted.
             *
             * @param {string} id The id of the service.
             * @return {boolean} True if the service is interpreted, false otherwise.
             */
            hasInterpretation: {
                arguments: ['string/id'],
                returns: 'boolean'
            },
            /**
             * Build the definitions of the services and instantiate the corresponding services.
             *
             * @param {boolean} reset Whether or not resetting the list of existent services.
             */
            build: {
                arguments: ['boolean/reset']
            },
            /**
             * Get the instantiation of a service (lazy instantiation).
             *
             * @param {string} id The id of the service.
             * @return {object} The service object.
             */
            get: {
                arguments: ['string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a service is instantiated.
             *
             * @param {string} id The id of the service.
             * @return {boolean} True if the service is instantiated, false otherwise.
             */
            has: {
                arguments: ['string/id'],
                returns: 'boolean'
            }
        },
        getters: {
            /**
             * The config handled parameters.
             *
             * @return {object} The parameters.
             */
            handledParameters: 'object'
        }
    },
    eventsContainer: {
        methods: {
            /**
             * Set an alias to a service.
             *
             * @param {string} alias The alias.
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             */
            setAlias: {
                arguments: ['string/alias', 'string/type', 'string/id']
            },
            /**
             * Set the definition of a service.
             *
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             * @param {object} definition The definition.
             */
            setDefinition: {
                arguments: ['string/type', 'string/id', 'object/definition']
            },
            /**
             * Get the definition of a service.
             *
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             * @return {object} The definition.
             */
            getDefinition: {
                arguments: ['string/type', 'string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a service is defined.
             *
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             * @return {boolean} True if the service is defined, false otherwise.
             */
            hasDefinition: {
                arguments: ['string/type', 'string/id'],
                returns: 'boolean'
            },
            /**
             * Build the definitions of the services and instantiate the corresponding services.
             *
             * @param {boolean} reset Whether or not resetting the list of existent services.
             */
            build: {
                arguments: ['boolean/reset']
            },
            /**
             * Get the instantiation of a service (lazy instantiation).
             *
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             * @return {object} The service object.
             */
            get: {
                arguments: ['string/type', 'string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a service is instantiated.
             *
             * @param {string} type The type of the event.
             * @param {string} id The id of the service.
             * @return {boolean} True if the service is instantiated, false otherwise.
             */
            has: {
                arguments: ['string/type', 'string/id'],
                returns: 'boolean'
            }
        }
    },
    collectionInterpreter: {
        methods: {
            /**
             * Interpret an operation on collection.
             *
             * @param {danf:manipulation.flow} flow The flow.
             * @param {function} callback The final callback.
             * @param {function} operation The operation.
             * @param {string|null} scope The optional scope.
             * @param {function|null} tributaryCallback The optional callback for the operation.
             * @param {array|object} operationArguments The arguments of the operation.
             * @param {function} retrieveContext The function allowing to retrieve the context.
             * @param {function} executeOperation The function allowing to execute the operation.
             * @param {function} endOperation The function allowing to end the operation.
             */
            interpret: {
                arguments: [
                    'danf:manipulation.flow/flow',
                    'function/callback',
                    'object/operation',
                    'string|null/scope',
                    'function|null/tributaryCallback',
                    'array|object/operationArguments',
                    'function/retrieveContext',
                    'function/executeOperation',
                    'function/endOperation'
                ]
            }
        },
        getters: {
            /**
             * The contract that a collection should respect in the configuration.
             *
             * @return {object} The contract.
             */
            contract: 'object'
        }
    },
    sequenceInterpreter: {
        methods: {
            /**
             * Build the sequencing shared context.
             *
             * @param {object} context The sequencing shared context.
             * @param {object} definition The definition of the sequence.
             */
            buildContext: {
                arguments: [
                    'object/context',
                    'object/definition'
                ]
            },
            /**
             * Interpret an operation on collection.
             *
             * @param {array} interpretation The interpretation of the sequence.
             * @param {object} definition The definition of the sequence.
             * @param {object} context The sequencing shared context.
             */
            interpret: {
                arguments: [
                    'array/interpretation',
                    'object/definition',
                    'object/context'
                ]
            }
        },
        getters: {
            /**
             * The contract that a sequence should respect in the configuration.
             *
             * @return {object} The contract.
             */
            contract: 'object',
            /**
             * The order of interpretation.
             *
             * @return {number} The order.
             */
            order: 'number'
        },
        setters: {
            /**
             * The sequences container.
             *
             * @param {danf:event.sequencesContainer} The sequences container.
             */
            sequencesContainer: 'danf:event.sequencesContainer'
        }
    },
    flowContext: {
        extends: 'danf:manipulation.map'
    },
    logger: {
        methods: {
            /**
             * Log a message.
             *
             * @param {string} message The message.
             * @param {number} verbosity The verbosity level.
             * @param {number} indentation The indentation level.
             * @param {number|null} tributary The tributary.
             * @param {number|null} level The current logging level.
             * @param {date|null} startedAt The start date of the task.
             */
            log: {
                arguments: [
                    'string/message',
                    'number/verbosity',
                    'number/indentation',
                    'number|null/tributary',
                    'number|null/level',
                    'date|null/startedAt'
                ]
            }
        }
    }
};