'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
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
            tags: ['danf:configuration.sectionProcessor'],
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
            tags: ['danf:configuration.configurationInterpreter'],
            children: {
                flatten: {
                    class: 'danf:manipulation.dataInterpreter.flatten'
                },
                default: {
                    class: 'danf:manipulation.dataInterpreter.default'
                },
                required: {
                    class: 'danf:manipulation.dataInterpreter.required'
                },
                type: {
                    class: 'danf:manipulation.dataInterpreter.type'
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
                namespaces: {
                    parent: 'danf:configuration.configurationInterpreter.abstractNamespacer',
                    class: 'danf:configuration.manipulation.dataInterpreter.namespaces'
                }
            }
        },
        referenceType: {
            tags: ['danf:manipulation.referenceType'],
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
});