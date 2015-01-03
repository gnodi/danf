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
            class: '%danf:event.classes.sequencerProvider%',
            properties: {
                class: '%danf:manipulation.sequencer%',
                interfacer: '#danf:object.interfacer#',
                sequencerStack: '#danf:event.sequencerStack#'
            }
        },
        sequenceBuilder: {
            class: '%danf:event.classes.sequenceBuilder%',
            properties: {
                referenceResolver: '#danf:manipulation.referenceResolver#',
                servicesContainer: '#danf:dependencyInjection.servicesContainer#',
                newSequencerProvider: '#danf:event.sequencerProvider#',
                currentSequencerProvider: '#danf:event.currentSequencerProvider#'
            }
        },
        sequencerStack: {
            class: '%danf:manipulation.classes.sequencerStack%'
        },
        eventsHandler: {
            class: '%danf:event.classes.eventsHandler%',
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
                    class: '%danf:event.classes.notifier.event%'
                }
            }
        },
        configurationSection: {
            parent: 'danf:configuration.sectionProcessor',
            children: {
                events: {
                    class: '%danf:event.classes.configurationSection.events%',
                    properties: {
                        name: 'events',
                        notifiers: '&danf:event.notifier&'
                    }
                },
                sequences: {
                    class: '%danf:event.classes.configurationSection.sequences%',
                    properties: {
                        name: 'sequences'
                    }
                }
            }
        }
    };
});