'use strict';

module.exports = {
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
            debug: '%danf:context.debug%',
            interfacesRegistry: '#danf:object.interfacesRegistry#'
        }
    },
    classProcessor: {
        tags: ['danf:object.classProcessor'],
        children: {
            extender: {
                class: 'danf:object.classProcessor.extender',
                properties: {
                    classesRegistry: '#danf:object.classesRegistry#',
                    baseClassName: 'danf:object.class'
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