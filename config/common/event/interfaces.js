'use strict';

module.exports = {
    eventsHandler: {
        methods: {
            /**
             * Add a notifier.
             *
             * @param {danf:event.notifier} notifier The notifier.
             */
            addNotifier: {
                arguments: ['danf:event.notifier/notifier']
            },
            /**
             * Add an event.
             *
             * @param {string} notifierName The identifier name of the notifier.
             * @param {string} name The identifier name of the event.
             * @param {object} event The description of the event.
             */
            addEvent: {
                arguments: [
                    'string/notifierName',
                    'string/name',
                    'object/event'
                ]
            }
        }
    },
    eventTrigger: {
        methods: {
            /**
             * Trigger an event.
             *
             * @param {string} notifierName The identifier name of the notifier.
             * @param {string} eventName The name of the event.
             * @param {object} trigger The object which triggered the event.
             * @param {mixed} data The data associated with the triggered event.
             */
            trigger: {
                arguments: [
                    'string/notifierName',
                    'string/eventName',
                    'object/trigger',
                    'mixed/data'
                ]
            }
        }
    },
    sequenceBuilder: {
        methods: {
            /**
             * Retrieve a built sequence.
             *
             * @param {string} name The identifier name of the sequence.
             * @return {danf:manipulation.sequencer} A sequencer.
             */
            get: {
                arguments: ['string/name'],
                returns: 'danf:manipulation.sequencer'
            },
            /**
             * Build a sequence.
             *
             * @param {string} name The identifier name of the sequence.
             * @param {object} event The description of the sequence.
             * @return {danf:manipulation.sequencer} A sequencer.
             */
            build: {
                arguments: ['string/name', 'object/event'],
                returns: 'danf:manipulation.sequencer'
            },
            /**
             * Compose sequences in a unique sequence.
             *
             * @param {string_array} sequences The identifier of the sequences.
             * @return {danf:manipulation.sequencer} A sequencer.
             */
            compose: {
                arguments: ['string_array/sequences'],
                returns: 'danf:manipulation.sequencer'
            }
        }
    },
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
             * Refresh listeners if needed.
             *
             * @param {object} data The data used to customize the refresh processing.
             */
            refreshListeners: {
                arguments: ['object/data']
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
             * @param {string} source The source of references.
             * @param {object} context The resolving context.
             */
            resolve: {
                arguments: ['string/source', 'object/context']
            },
            /**
             * Resolve references of a specific type.
             *
             * @param {string} source The source of references.
             * @param {string} type The identifier of a reference type.
             * @param {object} context The resolving context.
             */
            resolveSpecific: {
                arguments: ['string/source', 'type/string', 'object/context']
            }
        }
    },
    sequence: {
        methods: {
            /**
             * Execute the sequence.
             *
             * @param {mixed} input The input of the sequence.
             * @param {string} scope The scope of execution in the stream.
             * @param {function|null} callback The optional callback.
             */
            execute: {
                arguments: [
                    'object/input',
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
             * @param {mixed} data The data related to the event.
             */
            trigger: {
                arguments: ['mixed/data']
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
             * @return {mixed_object} The parameters.
             */
            parameters: 'mixed_object',
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
             * @param {mixed_array} operationArguments The arguments of the operation.
             * @param {function} retrieveContext The function allowing to retrieve the context.
             * @param {function} executeOperation The function allowing to execute the operation.
             * @param {function} endOperation The function allowing to end the operation.
             */
            interpret: {
                arguments: [
                    'danf:manipulation.flow/flow',
                    'function/callback',
                    'function/operation',
                    'string|null/scope',
                    'function|null/tributaryCallback',
                    'mixed_array/operationArguments',
                    'function/retrieveContext',
                    'function/executeOperation',
                    'function/endOperation'
                ]
            }
        }
    },
    sequenceInterpreter: {
        methods: {
            /**
             * Build the sequencing shared context.
             *
             * @param {mixed_object} context The sequencing shared context.
             * @param {object} definition The definition of the sequence.
             */
            buildContext: {
                arguments: [
                    'mixed_object/context',
                    'object/definition'
                ]
            },
            /**
             * Interpret an operation on collection.
             *
             * @param {array} interpretation The interpretation of the sequence.
             * @param {object} definition The definition of the sequence.
             * @param {mixed_object} context The sequencing shared context.
             */
            interpret: {
                arguments: [
                    'array/interpretation',
                    'object/definition',
                    'mixed_object/context'
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
    }
};