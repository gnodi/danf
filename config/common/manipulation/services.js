'use strict';

module.exports = {
    referenceResolver: {
        class: 'danf:manipulation.referenceResolver',
        properties: {
            referenceTypes: '&danf:manipulation.referenceType&'
        }
    },
    referenceType: {
        tags: ['danf:manipulation.referenceType'],
        class: 'danf:manipulation.referenceType',
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
        class: 'danf:manipulation.dataResolver',
        properties: {
            dataInterpreters: '&danf:manipulation.dataInterpreter&'
        }
    },
    dataInterpreter: {
        tags: ['danf:manipulation.dataInterpreter'],
        children: {
            flatten: {
                class: 'danf:manipulation.dataInterpreter.flatten'
            },
            default: {
                class: 'danf:manipulation.dataInterpreter.default'
            },
            required: {
                class: 'danf:manipulation.dataInterpreter.required'
            },
            type: {
                class: 'danf:manipulation.dataInterpreter.type'
            }
        }
    },
    callbackExecutor: {
        class: 'danf:manipulation.callbackExecutor'
    },
    sequencerProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:manipulation.sequencer',
            interface: 'danf:manipulation.sequencer'
        }
    }
};