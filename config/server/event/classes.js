module.exports = {
    sequencerProvider: require('../../../lib/common/event/sequencer-provider'),
    sequenceBuilder: require('../../../lib/common/event/sequence-builder'),
    eventsHandler: require('../../../lib/common/event/events-handler'),
    notifier: {
        abstract: require('../../../lib/common/event/notifier/abstract'),
        event: require('../../../lib/common/event/notifier/event')
    },
    configurationSection: {
        events: require('../../../lib/common/event/configuration-section/events'),
        sequences: require('../../../lib/common/event/configuration-section/sequences')
    }
};