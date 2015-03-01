'use strict';

define(function(require) {
    return {
        referenceResolver: require('-/danf/lib/common/manipulation/reference-resolver'),
        referenceType: require('-/danf/lib/common/manipulation/reference-type'),
        dataResolver: require('-/danf/lib/common/manipulation/data-resolver'),
        sequencer: require('-/danf/lib/common/manipulation/sequencer'),
        sequencerStack: require('-/danf/lib/common/manipulation/sequencer-stack'),
        registry: require('-/danf/lib/common/manipulation/registry'),
        notifierRegistry: require('-/danf/lib/common/manipulation/notifier-registry'),
        callbackExecutor: require('-/danf/lib/common/manipulation/callback-executor'),
        dataInterpreter: {
            abstract: require('-/danf/lib/common/manipulation/data-interpreter/abstract'),
            flatten: require('-/danf/lib/common/manipulation/data-interpreter/flatten'),
            default: require('-/danf/lib/common/manipulation/data-interpreter/default'),
            required: require('-/danf/lib/common/manipulation/data-interpreter/required'),
            type: require('-/danf/lib/common/manipulation/data-interpreter/type')
        }
    };
});