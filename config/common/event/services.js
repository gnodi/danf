'use strict';

module.exports = {
    logger: {
        class: 'danf:event.logger',
        properties: {
            logger: '#danf:logging.logger#'
        }
    },
    flowContext: {
        class: 'danf:event.flowContext'
    },
    referencesResolver: {
        class: 'danf:event.referencesResolver',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            flowContext: '#danf:event.flowContext#',
        }
    },
    sequenceProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:event.sequence',
            interface: 'danf:event.sequence',
            properties: {
                mapProvider: '#danf:manipulation.mapProvider#',
                flowProvider: '#danf:manipulation.flowProvider#',
                uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#'
            }
        }
    },
    eventProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:event.event',
            interface: 'danf:event.event'
        }
    },
    sequencesContainer: {
        class: 'danf:event.sequencesContainer',
        properties: {
            flowDriver: '#danf:manipulation.flowDriver#',
            sequenceProvider: '#danf:event.sequenceProvider#',
            sequenceInterpreters: '&danf:event.sequenceInterpreter&'
        }
    },
    eventsContainer: {
        class: 'danf:event.eventsContainer',
        properties: {
            sequencesContainer: '#danf:event.sequencesContainer#',
            eventProvider: '#danf:event.eventProvider#',
            notifiers: '&danf:event.notifier&'
        },
        registry: {
            method: 'get',
            namespace: [1]
        }
    },
    collectionInterpreter: {
        class: 'danf:event.collectionInterpreter',
        properties: {
            referencesResolver: '#danf:event.referencesResolver#',
            flowDriver: '#danf:manipulation.flowDriver#',
            asynchronousCollections: '&danf:manipulation.asynchronousCollection&'
        }
    },
    sequenceInterpreter: {
        tags: ['danf:event.sequenceInterpreter'],
        properties: {
            logger: '#danf:event.logger#'
        },
        children: {
            abstract: {
                abstract: true
            },
            alias: {
                class: 'danf:event.sequenceInterpreter.alias'
            },
            children: {
                class: 'danf:event.sequenceInterpreter.children',
                properties: {
                    uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#',
                    referencesResolver: '#danf:event.referencesResolver#',
                    collectionInterpreter: '#danf:event.collectionInterpreter#'
                }
            },
            collections: {
                class: 'danf:event.sequenceInterpreter.collections'
            },
            input: {
                class: 'danf:event.sequenceInterpreter.input',
                properties: {
                    dataResolver: '#danf:manipulation.dataResolver#'
                }
            },
            operations: {
                class: 'danf:event.sequenceInterpreter.operations',
                properties: {
                    referencesResolver: '#danf:event.referencesResolver#',
                    servicesContainer: '#danf:dependencyInjection.servicesContainer#',
                    collectionInterpreter: '#danf:event.collectionInterpreter#'
                }
            },
            parents: {
                class: 'danf:event.sequenceInterpreter.parents',
                properties: {
                    uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#',
                    referencesResolver: '#danf:event.referencesResolver#',
                    collectionInterpreter: '#danf:event.collectionInterpreter#'
                }
            }
        }
    },
    notifier: {
        tags: ['danf:event.notifier'],
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
                            collectionInterpreter: '#danf:event.collectionInterpreter#',
                            notifiers: '&danf:event.notifier&'
                        }
                    },
                    sequences: {
                        class: 'danf:event.configuration.sectionProcessor.sequences',
                        properties: {
                            name: 'sequences',
                            sequenceInterpreters: '&danf:event.sequenceInterpreter&'
                        }
                    }
                }
            }
        }
    }
};