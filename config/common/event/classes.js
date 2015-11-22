'use strict';

module.exports = {
    event: require('../../../lib/common/event/event'),
    eventsContainer: require('../../../lib/common/event/events-container'),
    notifier: {
        abstract: require('../../../lib/common/event/notifier/abstract'),
        event: require('../../../lib/common/event/notifier/event')
    },
    configuration: {
        sectionProcessor: {
            events: require('../../../lib/common/event/configuration/section-processor/events')
        }
    }
};