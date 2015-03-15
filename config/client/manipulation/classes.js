'use strict';

define(function(require) {
    return {
        referenceResolver: require('../../../lib/common/manipulation/reference-resolver'),
        referenceType: require('../../../lib/common/manipulation/reference-type'),
        dataResolver: require('../../../lib/common/manipulation/data-resolver'),
        sequencer: require('../../../lib/common/manipulation/sequencer'),
        sequencerStack: require('../../../lib/common/manipulation/sequencer-stack'),
        registry: require('../../../lib/common/manipulation/registry'),
        notifierRegistry: require('../../../lib/common/manipulation/notifier-registry'),
        callbackExecutor: require('../../../lib/common/manipulation/callback-executor'),
        dataInterpreter: {
            abstract: require('../../../lib/common/manipulation/data-interpreter/abstract'),
            flatten: require('../../../lib/common/manipulation/data-interpreter/flatten'),
            default: require('../../../lib/common/manipulation/data-interpreter/default'),
            required: require('../../../lib/common/manipulation/data-interpreter/required'),
            type: require('../../../lib/common/manipulation/data-interpreter/type')
        }
    };
});