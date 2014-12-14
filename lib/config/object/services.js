'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        classesRegistry: {
            class: '%danf:object.classes.classesRegistry%',
            lock: true
        },
        interfacesRegistry: {
            class: '%danf:object.classes.interfacesRegistry%',
            lock: true
        },
        classesHandler: {
            class: '%danf:object.classes.classesHandler%',
            properties: {
                classesRegistry: '#danf:object.classesRegistry#',
                classProcessors: '&danf:object.classProcessor&'
            },
            lock: true
        },
        interfacer: {
            class: '%danf:object.classes.interfacer%',
            properties: {
                interfacesRegistry: '#danf:object.interfacesRegistry#'
            }
        },
        classProcessor: {
        	tags: ['danf:object.classProcessor'],
            children: {
                extender: {
                    class: '%danf:object.classes.classProcessor.extender%',
                    properties: {
                        classesRegistry: '#danf:object.classesRegistry#'
                    }
                },
                interfacer: {
                    class: '%danf:object.classes.classProcessor.interfacer%',
                    properties: {
                        interfacesRegistry: '#danf:object.interfacesRegistry#'
                    }
                }
            }
        },
        configurationSection: {
            parent: 'danf:configuration.sectionProcessor',
            children: {
                interfaces: {
                    class: '%danf:object.classes.configurationSection.interfaces%',
                    properties: {
                        name: 'interfaces'
                    }
                },
                classes: {
                    class: '%danf:object.classes.configurationSection.classes%',
                    properties: {
                        name: 'classes'
                    }
                }
            }
        },
    };
});