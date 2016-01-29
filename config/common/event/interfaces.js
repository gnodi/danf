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
            },
            /**
             * Merge a field of contract.
             *
             * @param {string} field The name of the field.
             * @param {mixed} parentValue The parent value.
             * @param {mixed} childValue The child value.
             */
            mergeContractField: {
                arguments: [
                    'string/field',
                    'mixed/parentValue',
                    'mixed/childValue'
                ]
            }
        },
        getters: {
            /**
             * Identifier name.
             *
             * @return {string}
             */
            name: 'string',
            /**
             * Contract that an event should respect in the configuration.
             *
             * @return {object}
             */
            contract: 'object'
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
            },
            /**
             * Set a parameter.
             *
             * @param {string} name The identifier name of the parameter.
             * @param {mixed} value The value of the parameter.
             */
            setParameter: {
                arguments: ['string/name', 'mixed/value']
            },
            /**
             * Set a parameter.
             *
             * @param {string} name The identifier name of the parameter.
             * @return {mixed} The value of the parameter.
             */
            getParameter: {
                arguments: ['string/name'],
                returns: 'mixed'
            },
            /**
             * Set a parameter.
             *
             * @param {string} name The identifier name of the parameter.
             * @return {boolean} Whether or not the parameter exists.
             */
            hasParameter: {
                arguments: ['string/name'],
                returns: 'boolean'
            }
        },
        getters: {
            /**
             * Identifier name.
             *
             * @return {danf:event.notifier}
             */
            name: 'string',
            /**
             * Parameters.
             *
             * @return {object}
             */
            parameters: 'object',
            /**
             * Sequence.
             *
             * @return {danf:sequencing.sequence}
             */
            sequence: 'danf:sequencing.sequence'
        },
        setters: {
            /**
             * Notifier.
             *
             * @param {danf:event.notifier}
             */
            notifier: 'danf:event.notifier'
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
    }
};