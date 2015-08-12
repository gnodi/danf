'use strict';

module.exports = {
    currentSequencerProvider: {
        parent: 'danf:dependencyInjection.contextProvider',
        properties: {
            interface: 'danf:manipulation.sequencer'
        }
    },
    sequencerProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        class: 'danf:event.sequencerProvider',
        properties: {
            class: 'danf:manipulation.sequencer',
            interface: 'danf:manipulation.sequencer',
            sequencerStack: '#danf:event.sequencerStack#'
        }
    },
    sequenceBuilder: {
        class: 'danf:event.sequenceBuilder',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            servicesContainer: '#danf:dependencyInjection.servicesContainer#',
            newSequencerProvider: '#danf:event.sequencerProvider#',
            currentSequencerProvider: '#danf:event.currentSequencerProvider#'
        }
    },
    sequencerStack: {
        class: 'danf:manipulation.sequencerStack'
    },
    eventsHandler: {
        class: 'danf:event.eventsHandler',
        properties: {
            sequenceBuilder: '#danf:event.sequenceBuilder#',
            modulesTree: '#danf:configuration.modulesTree#',
            namespacer: '#danf:configuration.namespacer#',
            notifiers: '&danf:event.notifier&'
        }
    },
    sequenceProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:event.sequence',
            interface: 'danf:event.sequence'
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
            servicesContainer: '#danf:dependencyInjection.servicesContainer#',
            sequencesContainer: '#danf:event.sequencesContainer#',
            eventProvider: '#danf:event.eventProvider#',
            notifiers: '&danf:event.notifier&'
        }
    },
    collectionInterpreter: {
        class: 'danf:event.collectionInterpreter',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            flowDriver: '#danf:manipulation.flowDriver#',
            asynchronousCollections: '&danf:manipulation.asynchronousCollection&'
        }
    },
    sequenceInterpreter: {
        tags: ['danf:event.sequenceInterpreter'],
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
                    referenceResolver: '#danf:manipulation.referenceResolver#',
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
                    referenceResolver: '#danf:manipulation.referenceResolver#',
                    servicesContainer: '#danf:dependencyInjection.servicesContainer#',
                    collectionInterpreter: '#danf:event.collectionInterpreter#'
                }
            },
            parents: {
                class: 'danf:event.sequenceInterpreter.parents',
                properties: {
                    referenceResolver: '#danf:manipulation.referenceResolver#',
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
                            name: 'sequences'
                        }
                    }
                }
            }
        }
    }
};