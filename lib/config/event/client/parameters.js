'use strict';

define(function(require) {
    return {
        classes: {
            sequenceBuilder: require('danf/event/sequence-builder'),
            eventsHandler: require('danf/event/events-handler'),
            notifier: {
                abstract: require('danf/event/notifier/abstract'),
                dom: require('danf/event/notifier/dom'),
                event: require('danf/event/notifier/event')
            },
            configurationSection: {
                events: require('danf/event/configuration-section/events'),
                sequences: require('danf/event/configuration-section/sequences')
            }
        }
    };
});