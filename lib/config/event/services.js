'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        sequencerProvider: {
            parent: 'danf:dependencyInjection.contextProvider',
            properties: {
                interface: 'danf:manipulation.sequencer'
            }
        },
        sequenceBuilder: {
            class: '%danf:event.classes.sequenceBuilder%',
            properties: {
                referenceResolver: '#danf:manipulation.referenceResolver#',
                servicesContainer: '#danf:dependencyInjection.servicesContainer#',
                newSequencerProvider: '#danf:manipulation.sequencerProvider#',
                currentSequencerProvider: '#danf:event.sequencerProvider#'
            }
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