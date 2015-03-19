'use strict';

module.exports = {
    module: {
        methods: {
            /**
             * Set a dependency of the module.
             *
             * @param {string} alias The alias of the dependency.
             * @param {danf:configuration.module} dependency The dependency module.
             */
            setDependency: {
                arguments: ['string/alias', 'danf:configuration.module/dependency']
            }
        },
        getters: {
            /**
             * The id of the module.
             *
             * @return {string} The id.
             */
            id: 'string',
            /**
             * The alias of the module.
             *
             * @return {string} The alias.
             */
            alias: 'string',
            /**
             * The level of the module.
             *
             * @return {number} The level.
             */
            level: 'number',
            /**
             * The contract of the module.
             *
             * @return {object} The id.
             */
            contract: 'object',
            /**
             * The config of the module.
             *
             * @return {object} The config.
             */
            config: 'object',
            /**
             * The parent of the module.
             *
             * @return {string} The parent.
             */
            parent: 'string',
            /**
             * The dependencies of the module.
             *
             * @return {danf:configuration.module_object} The dependencies.
             */
            dependencies: 'danf:configuration.module_object'
        },
        setters: {
            /**
             * The id of the module.
             *
             * @param {string} id The id.
             */
            id: 'string',
            /**
             * The alias of the module.
             *
             * @param {string} alias The alias.
             */
            alias: 'string',
            /**
             * The level of the module.
             *
             * @param {number} level The level.
             */
            level: 'number',
            /**
             * The contract of the module.
             *
             * @param {object} contract The id.
             */
            contract: 'object',
            /**
             * The config of the module.
             *
             * @param {object} config The config.
             */
            config: 'object',
            /**
             * The parent of the module.
             *
             * @param {string} parent The parent.
             */
            parent: 'string',
            /**
             * The dependencies of the module.
             *
             * @param {danf:configuration.module_object} dependencies The dependencies.
             */
            dependencies: 'danf:configuration.module_object'
        }
    },
    modulesTree: {
        methods: {
            /**
             * Build the tree of the modules.
             *
             * @param {danf:configuration.module} root The danf root module.
             */
            build: {
                arguments: ['danf:configuration.module/root']
            },
            /**
             * Get the root module.
             *
             * @return {danf:configuration.module} The root module.
             */
            getRoot: {
                returns: 'danf:configuration.module'
            },
            /**
             * Get a module from its id.
             *
             * @param {string} id The id of the module.
             * @return {danf:configuration.module} The module.
             */
            get: {
                arguments: ['string/id'],
                returns: 'danf:configuration.module'
            },
            /**
             * Get the modules of a level.
             *
             * @param {number} level A level of definition.
             * @return {danf:configuration.module_array} The modules of the level.
             */
            getLevel: {
                arguments: ['number/level'],
                returns: 'danf:configuration.module_array'
            },
            /**
             * Get the modules with no hierarchy ordered by level.
             *
             * @param {boolean} inversed Inversed order?
             * @return {danf:configuration.module_array} The modules with no hierarchy.
             */
            getFlat: {
                arguments: ['boolean|undefined/inversed'],
                returns: 'danf:configuration.module_array'
            },
            /**
             * Get the child module of another module from its relative id.
             *
             * @param {danf:configuration.module} module The module.
             * @param {string} relativeId The child module id relative to the module.
             * @return {danf:configuration.module} The child module.
             */
            getChild: {
                arguments: ['danf:configuration.module/module', 'string/relativeId'],
                returns: 'danf:configuration.module'
            }
        },
        getters: {
            /**
             * The name of the application.
             *
             * @return {string} The name.
             */
            appName: 'string',
        }
    },
    namespacer: {
        methods: {
            /**
             * Prefix a source with its namespace.
             *
             * @param {string} source The source.
             * @param {danf:configuration.module} The module.
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {string} The prefixed source.
             */
            prefix: {
                arguments: ['string/source', 'danf:configuration.module/module', 'danf:configuration.modulesTree/modulesTree'],
                returns: 'string'
            },
            /**
             * Prefix a source with its namespace.
             *
             * @param {mixed} source The source.
             * @param {string} type The type of the references.
             * @param {danf:configuration.module} The module.
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {mixed} The source with prefixed references.
             */
            prefixReferences: {
                arguments: ['mixed/source', 'string/delimiter', 'danf:configuration.module/module', 'danf:configuration.modulesTree/modulesTree'],
                returns: 'mixed'
            }
        }
    },
    processor: {
        methods: {
            /**
             * Process the config of the modules.
             *
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {object} The processed config for the modules tree.
             * @api public
             */
            process: {
                arguments: ['danf:configuration.modulesTree/modulesTree'],
                returns: 'object'
            }
        }
    },
    sectionProcessor: {
        methods: {
            /**
             * Pre process the config.
             *
             * @param {object} The config.
             * @param {object} The config of the section.
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {object} The processed config.
             */
            preProcess: {
                arguments: ['object/config', 'object/sectionConfig', 'danf:configuration.modulesTree|undefined/modulesTree'],
                returns: 'object'
            },
            /**
             * Process the config of the section.
             *
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @param {string} environment The environment.
             * @return {object} The processed config.
             */
            process: {
                arguments: ['danf:configuration.modulesTree/modulesTree', 'string/environment'],
                returns: 'object'
            },
            /**
             * Post process the config.
             *
             * @param {object} The config.
             * @param {object} The config of the section.
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {object} The processed config.
             */
            postProcess: {
                arguments: ['object/config', 'object/sectionConfig', 'danf:configuration.modulesTree|undefined/modulesTree'],
                returns: 'object'
            },
            /**
             * Interpret all the config sections of a module.
             *
             * @param {object} config The config of the module.
             * @param {danf:configuration.module} module The module.
             * @param {danf:configuration.modulesTree} modulesTree The modules tree.
             * @return {object} The interpreted config of the module.
             */
            interpretAllModuleConfig: {
                arguments: ['object/config', 'danf:configuration.module/module', 'danf:configuration.modulesTree/modulesTree'],
                returns: 'object'
            }
        },
        getters: {
            /**
             * The name of the section.
             *
             * @return {string} The name.
             */
            name: 'string',
            /**
             * The contract that the config must respect.
             *
             * @return {object} The contract.
             */
            contract: 'object',
            /**
             * Whether or not the section must be processed in priority.
             *
             * @return {boolean} True if the section must be processed in priority, false otherwise.
             */
            priority: 'boolean'
        },
        setters: {
            /**
             * The contract that the config must respect.
             *
             * @param {object} The contract.
             */
            contract: 'object'
        }
    }
};