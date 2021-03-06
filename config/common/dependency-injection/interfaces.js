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
             * @return {object|function} The service object.
             */
            get: {
                arguments: ['string/id'],
                returns: 'object|function'
            },
            /**
             * Set an already instantiated service.
             *
             * @param {string} id The id of the service.
             * @param {object|function} service The service object.
             */
            set: {
                arguments: ['string/id', 'object|function/service']
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
             * Config.
             *
             * @return {object}
             */
            config: 'object',
            /**
             * Config handled parameters.
             *
             * @return {object}
             */
            handledParameters: 'object'
        },
        setters: {
            /**
             * Config.
             *
             * @param {object}
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
             * Contract its handled parameters should respect.
             *
             * @return {object}
             */
            contract: 'object',
            /**
             * Define order of execution.
             *
             * @return {number|null}
             */
            defineOrder: 'number|null',
            /**
             * Instantiate order of execution.
             *
             * @return {number|null}
             */
            instantiateOrder: 'number|null'
        }

    },
    provider: {
        methods: {
            /**
             * Provide an object.
             *
             * @param {object} properties The properties to inject to the provided object.
             * @return {object} The object.
             */
            provide: {
                arguments: ['object|null/properties'],
                returns: 'object'
            }
        },
        getters: {
            /**
             * Object provided type.
             *
             * @return {string}
             */
            providedType: 'string'
        }
    }
};