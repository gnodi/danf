'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        configurationSection: {
            parent: 'danf:configuration.sectionProcessor',
            children: {
                services: {
                    class: '%danf:dependencyInjection.classes.configurationSection.services%',
                    properties: {
                        name: 'services',
                        servicesContainer: '#danf:dependencyInjection.servicesContainer#'
                    }
                }
            }
        },
        referenceType: {
            tags: ['danf:manipulation.referenceType'],
            class: '%danf:manipulation.referenceType%',
            children: {
                service: {
                    properties: {
                        name: '#',
                        delimiter: '#',
                        allowsConcatenation: false
                    }
                },
                serviceFactory: {
                    properties: {
                        name: '>',
                        delimiter: '>',
                        size: 3,
                        allowsConcatenation: false
                    }
                },
                serviceTag: {
                    properties: {
                        name: '&',
                        delimiter: '&',
                        allowsConcatenation: false
                    }
                }
            }
        },
        contextProvider: {
            class: '%danf:dependencyInjection.classes.contextProvider%',
            properties: {
                interfacer: '#danf:object.interfacer#'
            },
            abstract: true
        },
        objectProvider: {
            class: '%danf:dependencyInjection.classes.objectProvider%',
            properties: {
                interfacer: '#danf:object.interfacer#'
            },
            abstract: true
        }
    };
});