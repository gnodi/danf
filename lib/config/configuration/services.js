'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        modulesTree: {
            class: '%danf:configuration.classes.modulesTree%',
            properties: {
                appName: '%danf:context.app%'
            },
            lock: true
        },
        namespacer: {
            class: '%danf:configuration.classes.namespacer%',
            properties: {
                referenceTypes: '&danf:manipulation.referenceType&'
            }
        },
        processor: {
            class: '%danf:configuration.classes.processor%',
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
            abstract: true,
            tags: ['danf:configuration.sectionProcessor'],
            properties: {
                configurationResolver: '#danf:configuration.configurationResolver#',
                referenceResolver: '#danf:manipulation.referenceResolver#',
                namespacer: '#danf:configuration.namespacer#'
            }
        },
        configurationSection: {
            parent: 'danf:configuration.sectionProcessor',
            children: {
                parameters: {
                    class: '%danf:configuration.classes.configurationSection.parameters%',
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
                    class: '%danf:manipulation.classes.dataInterpreter.flatten%'
                },
                default: {
                    class: '%danf:manipulation.classes.dataInterpreter.default%'
                },
                required: {
                    class: '%danf:manipulation.classes.dataInterpreter.required%'
                },
                type: {
                    class: '%danf:manipulation.classes.dataInterpreter.type%'
                },
                abstractNamespacer: {
                    properties: {
                        namespacer: '#danf:configuration.namespacer#'
                    },
                    abstract: true
                },
                references: {
                    parent: 'danf:configuration.configurationInterpreter.abstractNamespacer',
                    class: '%danf:configuration.classes.dataInterpreter.references%'
                },
                namespaces: {
                    parent: 'danf:configuration.configurationInterpreter.abstractNamespacer',
                    class: '%danf:configuration.classes.dataInterpreter.namespaces%'
                }
            }
        },
        referenceType: {
            tags: ['danf:manipulation.referenceType'],
            class: '%danf:manipulation.referenceType%',
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