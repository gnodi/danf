'use strict';

module.exports = {
    eventProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:event.event',
            interface: 'danf:event.event'
        }
    },
    eventsContainer: {
        class: 'danf:event.eventsContainer',
        properties: {
            sequencesContainer: '#danf:sequencing.sequencesContainer#',
            eventProvider: '#danf:event.eventProvider#',
            notifiers: '&danf:event.notifier&'
        },
        registry: {
            method: 'get',
            namespace: [1]
        }
    },
    notifier: {
        collections: ['danf:event.notifier'],
        properties: {
            dataResolver: '#danf:manipulation.dataResolver#'
        },
        children: {
            abstract: {
                abstract: true
            },
            event: {
                class: 'danf:event.notifier.event'
            }
        }
    },
    configuration: {
        children: {
            sectionProcessor: {
                parent: 'danf:configuration.sectionProcessor',
                children: {
                    events: {
                        class: 'danf:event.configuration.sectionProcessor.events',
                        properties: {
                            name: 'events',
                            collectionInterpreter: '#danf:sequencing.collectionInterpreter#',
                            notifiers: '&danf:event.notifier&'
                        }
                    }
                }
            }
        }
    }
};