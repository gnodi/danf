'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
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
        configurationSection: {
            parent: 'danf:configuration.sectionProcessor',
            children: {
                events: {
                    class: 'danf:event.configurationSection.events',
                    properties: {
                        name: 'events',
                        notifiers: '&danf:event.notifier&'
                    }
                },
                sequences: {
                    class: 'danf:event.configurationSection.sequences',
                    properties: {
                        name: 'sequences'
                    }
                }
            }
        }
    };
});