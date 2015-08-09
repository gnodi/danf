'use strict';

module.exports = {
    servicesContainer: {
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
             * Merge two definitions.
             *
             * @param {object} parent The definition of the parent.
             * @param {object} child The definition of the child.
             * @return {object} The merged definition of the child.
             */
            mergeDefinitions: {
                arguments: ['object/parent', 'object/child'],
                returns: 'object'
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
             * Finalize the building of the services.
             */
            finalize: {
                arguments: []
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
             * Set an already instantiated service.
             *
             * @param {string} id The id of the service.
             * @param {object} service The service object.
             */
            set: {
                arguments: ['string/id', 'object/service']
            },
            /**
             * Unset an instantiated service from the services container.
             *
             * @param {string} id The id of the service.
             */
            unset: {
                arguments: ['string/id']
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
            },
            /**
             * Set a dependency.
             *
             * @param {string} id The id of the service.
             * @param {string} dependencyId The id of the dependent service.
             * @param {string} property The property handling the dependency.
             * @param {string|number|null} index The optional index or key of the property.
             */
            setDependency: {
                arguments: [
                    'string/id',
                    'string/dependencyId',
                    'string/property',
                    'string|number|null/index'
                ]
            }
        },
        getters: {
            /**
             * The config.
             *
             * @return {object} The config.
             */
            config: 'object',
            /**
             * The config handled parameters.
             *
             * @return {object} The parameters.
             */
            handledParameters: 'object'
        },
        setters: {
            /**
             * The config.
             *
             * @param {object} The config.
             */
            config: 'object'
        }
    },
    serviceBuilder: {
        methods: {
            /**
             * Define a service.
             * Process all the service handlers for a definition.
             *
             * @param {object} service The service definition.
             * @return {object} The handled definition.
             */
            define: {
                arguments: ['object/service'],
                returns: 'object'
            },
            /**
             * Merge 2 service definitions.
             *
             * @param {object} parent The parent definition.
             * @param {object} child The child definition.
             * @return {object} The child merged definition.
             */
            merge: {
                arguments: ['object/parent', 'object/child'],
                returns: 'object'
            },
            /**
             * Instanciate a service.
             *
             * @param {object|null} instance The service instance.
             * @param {object} service The service definition.
             * @return {object|null} The handled instance.
             */
            instantiate: {
                arguments: ['object|null/instance', 'object/definition'],
                returns: 'object|null'
            },
            /**
             * Finalize a service.
             *
             * @param {object} instance The service instance.
             * @param {object} service The service definition.
             * @return {object} The handled instance.
             */
            finalize: {
                arguments: ['object|null/instance', 'object/definition'],
                returns: 'object'
            },
            /**
             * Update a service.
             *
             * @param {object} instance The service instance.
             * @param {object} service The service definition.
             * @return {object} The handled instance.
             */
            update: {
                arguments: ['object/instance', 'object/definition'],
                returns: 'object'
            }
        },
        getters: {
            /**
             * The contract its handled parameters should respect.
             *
             * @return {object} The contract.
             */
            contract: 'object',
            /**
             * The define order of execution.
             *
             * @return {number|undefined} The order.
             */
            defineOrder: 'number|undefined',
            /**
             * The instantiate order of execution.
             *
             * @return {number|undefined} The order.
             */
            instantiateOrder: 'number|undefined'
        }

    },
    provider: {
        methods: {
            /**
             * Provide an object.
             *
             * @param {mixed} argument1...N Some optional arguments.
             * @return {object} An object.
             */
            provide: {
                arguments: ['mixed.../argument1...N'],
                returns: 'object'
            }
        },
        getters: {
            /**
             * The object provided type.
             *
             * @return {string} The type.
             */
            providedType: 'string'
        }
    },
    contextProvider: {
        extends: 'danf:dependencyInjection.provider',
        methods: {
            /**
             * Set the context.
             *
             * @return {mixed} The context.
             */
            set: {
                arguments: ['mixed/context']
            },
            /**
             * Unset the context.
             */
            unset: {}
        }
    },
    objectProvider: {
        extends: 'danf:dependencyInjection.provider',
        setters: {
            /**
             * The class of the provided objects.
             *
             * @param function The class.
             */
            class: 'function'
        }
    }
};