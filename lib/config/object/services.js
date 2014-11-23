'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        classesIndexer: {
            class: '%danf:object.classes.classesIndexer%',
            lock: true
        },
        interfacesIndexer: {
            class: '%danf:object.classes.interfacesIndexer%',
            lock: true
        },
        classesHandler: {
            class: '%danf:object.classes.classesHandler%',
            properties: {
                classesIndexer: '#danf:object.classesIndexer#',
                classProcessors: '&danf:object.classProcessor&'
            },
            lock: true
        },
        interfacer: {
            class: '%danf:object.classes.interfacer%',
            properties: {
                interfacesIndexer: '#danf:object.interfacesIndexer#'
            }
        },
        classProcessor: {
        	tags: ['danf:object.classProcessor'],
            children: {
                extender: {
                    class: '%danf:object.classes.classProcessor.extender%',
                    properties: {
                        classesIndexer: '#danf:object.classesIndexer#'
                    }
                },
                interfacer: {
                    class: '%danf:object.classes.classProcessor.interfacer%',
                    properties: {
                        interfacesIndexer: '#danf:object.interfacesIndexer#'
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