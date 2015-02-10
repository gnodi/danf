'use strict';

module.exports = {
    referenceResolver: require('../../../manipulation/reference-resolver'),
    referenceType: require('../../../manipulation/reference-type'),
    dataResolver: require('../../../manipulation/data-resolver'),
    sequencer: require('../../../manipulation/sequencer'),
    sequencerStack: require('../../../manipulation/sequencer-stack'),
    registry: require('../../../manipulation/registry'),
    notifierRegistry: require('../../../manipulation/notifier-registry'),
    callbackExecutor: require('../../../manipulation/callback-executor'),
    dataInterpreter: {
        abstract: require('../../../manipulation/data-interpreter/abstract'),
        flatten: require('../../../manipulation/data-interpreter/flatten'),
        default: require('../../../manipulation/data-interpreter/default'),
        required: require('../../../manipulation/data-interpreter/required'),
        type: require('../../../manipulation/data-interpreter/type')
    }
};