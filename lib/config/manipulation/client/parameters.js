'use strict';

define(function(require) {
    return {
        classes: {
            referenceResolver: require('danf/manipulation/reference-resolver'),
            referenceType: require('danf/manipulation/reference-type'),
            dataResolver: require('danf/manipulation/data-resolver'),
            sequencer: require('danf/manipulation/sequencer'),
            sequencerStack: require('danf/manipulation/sequencer-stack'),
            registry: require('danf/manipulation/registry'),
            notifierRegistry: require('danf/manipulation/notifier-registry'),
            callbackExecutor: require('danf/manipulation/callback-executor'),
            dataInterpreter: {
                abstract: require('danf/manipulation/data-interpreter/abstract'),
                flatten: require('danf/manipulation/data-interpreter/flatten'),
                default: require('danf/manipulation/data-interpreter/default'),
                required: require('danf/manipulation/data-interpreter/required'),
                type: require('danf/manipulation/data-interpreter/type')
            }
        }
    };
});