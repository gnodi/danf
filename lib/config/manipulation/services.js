'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        referenceResolver: {
            class: '%danf:manipulation.classes.referenceResolver%',
            properties: {
                referenceTypes: '&danf:manipulation.referenceType&'
            }
        },
        referenceType: {
            tags: ['danf:manipulation.referenceType'],
            class: '%danf:manipulation.referenceType%',
            children: {
                parameter: {
                    properties: {
                        name: '%',
                        delimiter: '%'
                    }
                },
                context: {
                    properties: {
                        name: '@',
                        delimiter: '@'
                    }
                }
            }
        },
        dataResolver: {
            class: '%danf:manipulation.classes.dataResolver%',
            properties: {
                dataInterpreters: '&danf:manipulation.dataInterpreter&'
            }
        },
        dataInterpreter: {
            tags: ['danf:manipulation.dataInterpreter'],
            children: {
                flatten: {
                    class: '%danf:manipulation.classes.dataInterpreter.flatten%'
                },
                default: {
                    class: '%danf:manipulation.classes.dataInterpreter.default%'
                },
                required: {
                    class: '%danf:manipulation.classes.dataInterpreter.required%'
                },
                type: {
                    class: '%danf:manipulation.classes.dataInterpreter.type%'
                }
            }
        },
        callbackExecutor: {
            class: '%danf:manipulation.classes.callbackExecutor%'
        },
        sequencerProvider: {
            parent: 'danf:dependencyInjection.objectProvider',
            properties: {
                class: '%danf:manipulation.classes.sequencer%',
                interface: 'danf:manipulation.sequencer'
            }
        }
    };
});