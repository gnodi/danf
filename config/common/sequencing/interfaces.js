'use strict';

module.exports = {
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
             * @param {mixed} source The source of references.
             * @param {string} type The identifier of a reference type.
             * @param {mixed} context The resolving context.
             * @param {string|null} inText An optionnal text specifying where the reference is declared (errors).
             * @return {mixed} The resolved references.
             */
            resolveSpecific: {
                arguments: [
                    'mixed/source',
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
             * @param {string|null} scope The scope of execution in the stream.
             * @param {function|null} callback The optional callback.
             */
            execute: {
                arguments: [
                    'object/input',
                    'object/context',
                    'string|null/scope',
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
             * Config handled parameters.
             *
             * @return {object}
             */
            handledParameters: 'object'
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
             * Contract that a collection should respect in the configuration.
             *
             * @return {object}
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
             * Contract that a sequence should respect in the configuration.
             *
             * @return {object}
             */
            contract: 'object',
            /**
             * Order of interpretation.
             *
             * @return {number}
             */
            order: 'number'
        },
        setters: {
            /**
             * Sequences container.
             *
             * @param {danf:sequencing.sequencesContainer}
             */
            sequencesContainer: 'danf:sequencing.sequencesContainer'
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