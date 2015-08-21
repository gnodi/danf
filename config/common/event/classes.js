'use strict';

module.exports = {
    referencesResolver: require('../../../lib/common/event/references-resolver'),
    sequence: require('../../../lib/common/event/sequence'),
    event: require('../../../lib/common/event/event'),
    sequencesContainer: require('../../../lib/common/event/sequences-container'),
    eventsContainer: require('../../../lib/common/event/events-container'),
    collectionInterpreter: require('../../../lib/common/event/collection-interpreter'),
    flowContext: require('../../../lib/common/event/flow-context'),
    sequenceInterpreter: {
        abstract: require('../../../lib/common/event/sequence-interpreter/abstract'),
        alias: require('../../../lib/common/event/sequence-interpreter/alias'),
        children: require('../../../lib/common/event/sequence-interpreter/children'),
        collections: require('../../../lib/common/event/sequence-interpreter/collections'),
        embedded: require('../../../lib/common/event/sequence-interpreter/embedded'),
        input: require('../../../lib/common/event/sequence-interpreter/input'),
        operations: require('../../../lib/common/event/sequence-interpreter/operations'),
        parents: require('../../../lib/common/event/sequence-interpreter/parents')
    },
    notifier: {
        abstract: require('../../../lib/common/event/notifier/abstract'),
        event: require('../../../lib/common/event/notifier/event')
    },
    configuration: {
        sectionProcessor: {
            events: require('../../../lib/common/event/configuration/section-processor/events'),
            sequences: require('../../../lib/common/event/configuration/section-processor/sequences')
        }
    }
};