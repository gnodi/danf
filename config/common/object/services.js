'use strict';

module.exports = {
    classesContainer: {
        class: 'danf:object.classesContainer',
        properties: {
            classProcessors: '&danf:object.classProcessor&'
        },
        lock: true
    },
    interfacesContainer: {
        class: 'danf:object.interfacesContainer',
        lock: true
    },
    interfacer: {
        class: 'danf:object.interfacer',
        properties: {
            debug: '%danf:context.debug%',
            interfacesContainer: '#danf:object.interfacesContainer#'
        }
    },
    classProcessor: {
        collections: ['danf:object.classProcessor'],
        children: {
            extender: {
                class: 'danf:object.classProcessor.extender'
            },
            interfacer: {
                class: 'danf:object.classProcessor.interfacer',
                properties: {
                    interfacesContainer: '#danf:object.interfacesContainer#'
                }
            }
        }
    },
    configuration: {
        children: {
            sectionProcessor: {
                parent: 'danf:configuration.sectionProcessor',
                children: {
                    interfaces: {
                        class: 'danf:object.configuration.sectionProcessor.interfaces',
                        properties: {
                            name: 'interfaces'
                        }
                    },
                    classes: {
                        class: 'danf:object.configuration.sectionProcessor.classes',
                        properties: {
                            name: 'classes'
                        }
                    }
                }
            }
        }
    },
};