'use strict';

module.exports = {
    classesContainer: {
        methods: {
            /**
             * Set the definition of a class.
             *
             * @param {string} id The id of the class.
             * @param {function} class The class.
             */
            setDefinition: {
                arguments: ['string/id', 'function/class']
            },
            /**
             * Get the definition of a class.
             *
             * @param {string} id The id of the class.
             * @return {object} The class.
             */
            getDefinition: {
                arguments: ['string/id'],
                returns: 'object'
            },
            /**
             * Whether or not a class is defined.
             *
             * @param {string} id The id of the class.
             * @return {boolean} True if the class is defined, false otherwise.
             */
            hasDefinition: {
                arguments: ['string/id'],
                returns: 'boolean'
            },
            /**
             * Build the definitions of the classes applying the class processors.
             */
            build: {
                arguments: []
            },
            /**
             * Get a processed class.
             *
             * @param {string} id The id of the class.
             * @return {function} The class.
             */
            get: {
                arguments: ['string/id'],
                returns: 'function'
            },
            /**
             * Whether or not a class has been processed.
             *
             * @param {string} id The id of the class.
             * @return {boolean} True if the class has been processed, false otherwise.
             */
            has: {
                arguments: ['string/id'],
                returns: 'boolean'
            }
        }
    },
    interfacesContainer: {
        methods: {
            /**
             * Set the definition of an interface.
             *
             * @param {string} id The id of the interface.
             * @param {object} definition The definition of the interface.
             */
            setDefinition: {
                arguments: ['string/id', 'object/definition']
            },
            /**
             * Get the definition of an interface.
             *
             * @param {string} id The id of the interface.
             * @return {object} The definition of the interface.
             */
            getDefinition: {
                arguments: ['string/id'],
                returns: 'object'
            },
            /**
             * Whether or not an interface is defined.
             *
             * @param {string} id The id of the interface.
             * @return {boolean} True if the interface is defined, false otherwise.
             */
            hasDefinition: {
                arguments: ['string/id'],
                returns: 'boolean'
            },
            /**
             * Build the definitions of the interfaces.
             */
            build: {
                arguments: []
            },
            /**
             * Get an interface.
             *
             * @param {string} id The id of the interface.
             * @return {danf:object.interface} The interface.
             */
            get: {
                arguments: ['string/id'],
                returns: 'danf:object.interface'
            },
            /**
             * Whether or not an interface has been processed.
             *
             * @param {string} id The id of the interface.
             * @return {boolean} True if the interface exists, false otherwise.
             */
            has: {
                arguments: ['string/id'],
                returns: 'boolean'
            }
        }
    },
    'interface': {
        methods: {
            /**
             * Whether or not the interface define a method.
             *
             * @param {string} methodName The name of the method.
             * @return {boolean} True if the interface define the method, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasMethod: {
                arguments: ['string/name', 'string/methodName'],
                returns: 'boolean'
            },
            /**
             * Get a method of the interface.
             *
             * @param {string} methodName The name of the method.
             * @return {object} The method.
             * @throw {error} If the method of the interface is not defined.
             */
            getMethod: {
                arguments: ['string/name', 'string/methodName'],
                returns: 'object'
            },
            /**
             * Whether or not the interface define a getter.
             *
             * @param {string} getterName The name of the getter.
             * @return {boolean} True if the interface define the getter, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasGetter: {
                arguments: ['string/name', 'string/getterName'],
                returns: 'boolean'
            },
            /**
             * Get a getter of the interface.
             *
             * @param {string} getterName The name of the getter.
             * @return {object} The getter.
             * @throw {error} If the getter of the interface is not defined.
             */
            getGetter: {
                arguments: ['string/name', 'string/getterName'],
                returns: 'string'
            },
            /**
             * Whether or not the interface define a setter.
             *
             * @param {string} setterName The name of the setter.
             * @return {boolean} True if the interface define the setter, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasSetter: {
                arguments: ['string/name', 'string/setterName'],
                returns: 'boolean'
            },
            /**
             * Get a setter of the interface.
             *
             * @param {string} setterName The name of the setter.
             * @return {object} The setter.
             * @throw {error} If the setter of the interface is not defined.
             */
            getSetter: {
                arguments: ['string/name', 'string/setterName'],
                returns: 'string'
            }
        },
        getters: {
            /**
             * The name.
             *
             * @return {string}
             */
            name: 'string',
            /**
             * The name of the extended interface.
             *
             * @return {string}
             */
            'extends': 'string',
            /**
             * The methods.
             *
             * @return {mixed_object_object}
             */
            methods: 'mixed_object_object',
            /**
             * The getters.
             *
             * @return {string_object}
             */
            getters: 'string_object',
            /**
             * The setters.
             *
             * @return {string_object}
             */
            setters: 'string_object'
        }
    },
    interfacer: {
        methods: {
            /**
             * Add a proxy on an object to ensure the respect of an interface.
             *
             * @param {object} object The object.
             * @param {string} interfaceName The name of the interface.
             */
            addProxy: {
                arguments: ['object/object', 'string/interfaceName']
            }
        }
    },
    classProcessor: {
        methods: {
            /**
             * Process a class.
             *
             * @param {function}
             */
            process: {
                arguments: ['function/class']
            }
        },
        getters: {
            /**
             * The order of execution.
             *
             * @return {number}
             */
            order: 'number'
        },
        setters: {
            /**
             * The classes container.
             *
             * @param {danf:object.classesContainer}
             */
            classesContainer: 'danf:object.classesContainer'
        }
    }
};