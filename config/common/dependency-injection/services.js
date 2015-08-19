'use strict';

module.exports = {
    configuration: {
        children: {
            sectionProcessor: {
                parent: 'danf:configuration.sectionProcessor',
                children: {
                    services: {
                        class: 'danf:dependencyInjection.configuration.sectionProcessor.services',
                        properties: {
                            name: 'services',
                            servicesContainer: '#danf:dependencyInjection.servicesContainer#'
                        }
                    }
                }
            }
        }
    },
    referenceType: {
        tags: ['danf:manipulation.referenceType'],
        class: 'danf:manipulation.referenceType',
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
    objectProvider: {
        class: 'danf:dependencyInjection.objectProvider',
        properties: {
            interfacer: '#danf:object.interfacer#',
            classesRegistry: '#danf:object.classesRegistry#',
            debug: '%danf:context.debug%'
        },
        abstract: true
    },
    registry: {
        class: 'danf:dependencyInjection.registry',
        properties: {
            interfacer: '#danf:object.interfacer#'
        },
        abstract: true
    }
};