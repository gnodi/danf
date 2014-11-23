module.exports = {
    classes: {
        sequenceBuilder: require('../../../event/sequence-builder'),
        eventsHandler: require('../../../event/events-handler'),
        notifier: {
            abstract: require('../../../event/notifier/abstract'),
            event: require('../../../event/notifier/event')
        },
        configurationSection: {
            events: require('../../../event/configuration-section/events'),
            sequences: require('../../../event/configuration-section/sequences')
        }
    }
};