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
        collections: ['danf:manipulation.referenceType'],
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
            serviceCollection: {
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
            classesContainer: '#danf:object.classesContainer#',
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