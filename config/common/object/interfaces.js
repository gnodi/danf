'use strict';

module.exports = {
    classesHandler: {
        methods: {
            /**
             * Process the classes.
             */
            process: {
            }
        }
    },
    classesRegistry: {
        methods: {
            /**
             * Index a class.
             *
             * @param {string} name The name of the class.
             * @param {string} class_ The class.
             */
            index: {
                arguments: ['string/name', 'function/class_']
            },
            /**
             * Whether or not the class has been indexed.
             *
             * @param {string} name The name of the class.
             * @return {boolean} True if the class has been indexed, false otherwise.
             */
            has: {
                arguments: ['string/name'],
                returns: 'boolean'
            },
            /**
             * Get a class from its name.
             *
             * @param {string} name The name of the class.
             * @return {function} The class.
             * @throw {error} If the class is not defined.
             */
            get: {
                arguments: ['string/name'],
                returns: 'function'
            },
            /**
             * Get all the classes.
             *
             * @return {function_object} The classes.
             */
            getAll: {
                returns: 'object'
            }
        }
    },
    interfacesRegistry: {
        methods: {
            /**
             * Index an interface.
             *
             * @param {string} name The name of the interface.
             * @param {string} interface_ The interface.
             */
            index: {
                arguments: ['string/name', 'object/interface_']
            },
            /**
             * Whether or not the interface has been indexed.
             *
             * @param {string} name The name of the interface.
             * @return {boolean} True if the interface has been indexed, false otherwise.
             */
            has: {
                arguments: ['string/name'],
                returns: 'boolean'
            },
            /**
             * Get a interface from its name.
             *
             * @param {string} name The name of the interface.
             * @return {function} The interface.
             * @throw {error} If the interface is not defined.
             */
            get: {
                arguments: ['string/name'],
                returns: 'object'
            },
            /**
             * Get all the interfaces.
             *
             * @return {object} The interfaces.
             */
            getAll: {
                returns: 'object'
            },
            /**
             * Whether or not an interface define a method.
             *
             * @param {string} name The name of the interface.
             * @param {string} methodName The name of the method.
             * @return {boolean} True if the interface define the method, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasMethod: {
                arguments: ['string/name', 'string/methodName'],
                returns: 'boolean'
            },
            /**
             * Get a method of an interface.
             *
             * @param {string} name The name of the interface.
             * @param {string} methodName The name of the method.
             * @return {object} The method.
             * @throw {error} If the method of the interface is not defined.
             */
            getMethod: {
                arguments: ['string/name', 'string/methodName'],
                returns: 'object'
            },
            /**
             * Whether or not an interface define a getter.
             *
             * @param {string} name The name of the interface.
             * @param {string} getterName The name of the getter.
             * @return {boolean} True if the interface define the getter, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasGetter: {
                arguments: ['string/name', 'string/getterName'],
                returns: 'boolean'
            },
            /**
             * Get a getter of an interface.
             *
             * @param {string} name The name of the interface.
             * @param {string} getterName The name of the getter.
             * @return {object} The getter.
             * @throw {error} If the getter of the interface is not defined.
             */
            getGetter: {
                arguments: ['string/name', 'string/getterName'],
                returns: 'string'
            },
            /**
             * Whether or not an interface define a setter.
             *
             * @param {string} name The name of the interface.
             * @param {string} setterName The name of the setter.
             * @return {boolean} True if the interface define the setter, false otherwise.
             * @throw {error} If the interface is not defined.
             */
            hasSetter: {
                arguments: ['string/name', 'string/setterName'],
                returns: 'boolean'
            },
            /**
             * Get a setter of an interface.
             *
             * @param {string} name The name of the interface.
             * @param {string} setterName The name of the setter.
             * @return {object} The setter.
             * @throw {error} If the setter of the interface is not defined.
             */
            getSetter: {
                arguments: ['string/name', 'string/setterName'],
                returns: 'string'
            }
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
             * @param {function} class_ The class.
             */
            process: {
                arguments: ['function/class_']
            }
        },
        getters: {
            /**
             * The order of execution.
             *
             * @return {number} The order.
             */
            order: 'number'
        }
    }
};