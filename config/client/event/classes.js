'use strict';

define(function(require) {
    return {
        sequencerProvider: require('-/danf/lib/common/event/sequencer-provider'),
        sequenceBuilder: require('-/danf/lib/common/event/sequence-builder'),
        eventsHandler: require('-/danf/lib/common/event/events-handler'),
        notifier: {
            abstract: require('-/danf/lib/common/event/notifier/abstract'),
            dom: require('-/danf/lib/client/event/notifier/dom'),
            event: require('-/danf/lib/common/event/notifier/event')
        },
        configurationSection: {
            events: require('-/danf/lib/common/event/configuration-section/events'),
            sequences: require('-/danf/lib/common/event/configuration-section/sequences')
        }
    };
});