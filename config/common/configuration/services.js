'use strict';

module.exports = {
    modulesTree: {
        class: 'danf:configuration.modulesTree',
        properties: {
            appName: '%danf:context.app%'
        },
        lock: true
    },
    namespacer: {
        class: 'danf:configuration.namespacer',
        properties: {
            referenceTypes: '&danf:manipulation.referenceType&'
        }
    },
    processor: {
        class: 'danf:configuration.processor',
        properties: {
            configurationResolver: '#danf:configuration.configurationResolver#',
            referenceResolver: '#danf:manipulation.referenceResolver#',
            namespacer: '#danf:configuration.namespacer#',
            sectionProcessors: '&danf:configuration.sectionProcessor&',
            environment: '%danf:context.environment%'
        },
        lock: true
    },
    sectionProcessor: {
        class: 'danf:configuration.sectionProcessor',
        collections: ['danf:configuration.sectionProcessor'],
        properties: {
            configurationResolver: '#danf:configuration.configurationResolver#',
            referenceResolver: '#danf:manipulation.referenceResolver#',
            namespacer: '#danf:configuration.namespacer#'
        },
        children: {
            parameters: {
                class: 'danf:configuration.sectionProcessor.parameters',
                properties: {
                    name: 'parameters'
                }
            }
        }
    },
    configurationResolver: {
        parent: 'danf:manipulation.dataResolver',
        properties: {
            dataInterpreters: '&danf:configuration.configurationInterpreter&'
        }
    },
    configurationInterpreter: {
        collections: ['danf:configuration.configurationInterpreter'],
        children: {
            default: {
                class: 'danf:manipulation.dataInterpreter.default'
            },
            flatten: {
                class: 'danf:manipulation.dataInterpreter.flatten'
            },
            format: {
                class: 'danf:manipulation.dataInterpreter.format'
            },
            required: {
                class: 'danf:manipulation.dataInterpreter.required'
            },
            type: {
                class: 'danf:manipulation.dataInterpreter.type'
            },
            validate: {
                class: 'danf:manipulation.dataInterpreter.validate'
            },
            abstractNamespacer: {
                properties: {
                    namespacer: '#danf:configuration.namespacer#'
                },
                abstract: true
            },
            references: {
                parent: 'danf:configuration.configurationInterpreter.abstractNamespacer',
                class: 'danf:configuration.manipulation.dataInterpreter.references'
            },
            namespace: {
                parent: 'danf:configuration.configurationInterpreter.abstractNamespacer',
                class: 'danf:configuration.manipulation.dataInterpreter.namespace'
            }
        }
    },
    referenceType: {
        collections: ['danf:manipulation.referenceType'],
        class: 'danf:manipulation.referenceType',
        children: {
            config: {
                properties: {
                    name: '$',
                    delimiter: '$'
                }
            }
        }
    },
};