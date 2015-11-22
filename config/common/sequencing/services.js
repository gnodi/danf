'use strict';

module.exports = {
    logger: {
        class: 'danf:sequencing.logger',
        properties: {
            logger: '#danf:logging.logger#'
        }
    },
    flowContext: {
        class: 'danf:sequencing.flowContext'
    },
    referencesResolver: {
        class: 'danf:sequencing.referencesResolver',
        properties: {
            referenceResolver: '#danf:manipulation.referenceResolver#',
            flowContext: '#danf:sequencing.flowContext#',
        }
    },
    sequenceProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:sequencing.sequence',
            interface: 'danf:sequencing.sequence',
            properties: {
                mapProvider: '#danf:manipulation.mapProvider#',
                flowProvider: '#danf:manipulation.flowProvider#',
                uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#'
            }
        }
    },
    sequencesContainer: {
        class: 'danf:sequencing.sequencesContainer',
        properties: {
            flowDriver: '#danf:manipulation.flowDriver#',
            sequenceProvider: '#danf:sequencing.sequenceProvider#',
            sequenceInterpreters: '&danf:sequencing.sequenceInterpreter&'
        },
        registry: {
            method: 'get',
            namespace: [0]
        }
    },
    collectionInterpreter: {
        class: 'danf:sequencing.collectionInterpreter',
        properties: {
            referencesResolver: '#danf:sequencing.referencesResolver#',
            flowDriver: '#danf:manipulation.flowDriver#',
            logger: '#danf:sequencing.logger#',
            asynchronousCollections: '&danf:manipulation.asynchronousCollection&'
        }
    },
    sequenceInterpreter: {
        collections: ['danf:sequencing.sequenceInterpreter'],
        properties: {
            logger: '#danf:sequencing.logger#'
        },
        children: {
            abstract: {
                abstract: true
            },
            alias: {
                class: 'danf:sequencing.sequenceInterpreter.alias'
            },
            children: {
                class: 'danf:sequencing.sequenceInterpreter.children',
                properties: {
                    uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#',
                    referencesResolver: '#danf:sequencing.referencesResolver#',
                    collectionInterpreter: '#danf:sequencing.collectionInterpreter#'
                }
            },
            collections: {
                class: 'danf:sequencing.sequenceInterpreter.collections'
            },
            stream: {
                class: 'danf:sequencing.sequenceInterpreter.stream',
                properties: {
                    dataResolver: '#danf:manipulation.dataResolver#'
                }
            },
            operations: {
                class: 'danf:sequencing.sequenceInterpreter.operations',
                properties: {
                    referencesResolver: '#danf:sequencing.referencesResolver#',
                    servicesContainer: '#danf:dependencyInjection.servicesContainer#',
                    collectionInterpreter: '#danf:sequencing.collectionInterpreter#'
                }
            },
            parents: {
                class: 'danf:sequencing.sequenceInterpreter.parents',
                properties: {
                    uniqueIdGenerator: '#danf:manipulation.uniqueIdGenerator#',
                    referencesResolver: '#danf:sequencing.referencesResolver#',
                    collectionInterpreter: '#danf:sequencing.collectionInterpreter#'
                }
            }
        }
    },
    configuration: {
        children: {
            sectionProcessor: {
                parent: 'danf:configuration.sectionProcessor',
                children: {
                    sequences: {
                        class: 'danf:sequencing.configuration.sectionProcessor.sequences',
                        properties: {
                            name: 'sequences',
                            sequenceInterpreters: '&danf:sequencing.sequenceInterpreter&'
                        }
                    }
                }
            }
        }
    }
};