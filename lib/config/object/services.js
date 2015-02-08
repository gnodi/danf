'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        classesRegistry: {
            class: 'danf:object.classesRegistry',
            lock: true
        },
        interfacesRegistry: {
            class: 'danf:object.interfacesRegistry',
            lock: true
        },
        classesHandler: {
            class: 'danf:object.classesHandler',
            properties: {
                classesRegistry: '#danf:object.classesRegistry#',
                classProcessors: '&danf:object.classProcessor&'
            },
            lock: true
        },
        interfacer: {
            class: 'danf:object.interfacer',
            properties: {
                interfacesRegistry: '#danf:object.interfacesRegistry#'
            }
        },
        classProcessor: {
        	tags: ['danf:object.classProcessor'],
            children: {
                extender: {
                    class: 'danf:object.classProcessor.extender',
                    properties: {
                        classesRegistry: '#danf:object.classesRegistry#'
                    }
                },
                interfacer: {
                    class: 'danf:object.classProcessor.interfacer',
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
                    class: 'danf:object.configurationSection.interfaces',
                    properties: {
                        name: 'interfaces'
                    }
                },
                classes: {
                    class: 'danf:object.configurationSection.classes',
                    properties: {
                        name: 'classes'
                    }
                }
            }
        },
    };
});