'use strict';

require('../../../../../lib/common/init');

var assert = require('assert'),
    Events = require('../../../../../lib/common/event/configuration/section-processor/events')
;

var events = new Events(),
    eventNotifier = {
        name: 'event',
        contract: {
            event: {type: 'string'}
        }
    },
    requestNotifier = {
        name: 'request',
        contract: {
            path: {type: 'string'},
            methods: {type: 'string_array'}
        }
    }
;

events.collectionInterpreter = {
    contract: 'plop'
};
events.addNotifier(eventNotifier);
events.addNotifier(requestNotifier);


describe('Events section configuration processor', function() {
    it('should aggregate the contracts of notifiers', function() {
        assert.deepEqual(
            events.contract,
            {
                event: {
                    type: 'embedded_object',
                    namespace: true,
                    references: ['$'],
                    embed: {
                        event: {type: 'string'},
                        sequences: {
                            type: 'embedded_array',
                            embed: {
                                name: {
                                    type: 'string',
                                    required: true,
                                    namespace: true
                                },
                                condition: {
                                    type: 'function'
                                },
                                order: {
                                    type: 'number',
                                    default: 0
                                },
                                collection: {
                                    type: 'embedded',
                                    embed: 'plop'
                                },
                                input: {
                                    type: 'mixed_object',
                                    default: {}
                                },
                                output: {
                                    type: 'mixed_object',
                                    default: {}
                                }
                            }
                        },
                        data: {type: 'object'}
                    }
                },
                request: {
                    type: 'embedded_object',
                    namespace: true,
                    references: ['$'],
                    embed: {
                        path: {type: 'string'},
                        methods: {type: 'string_array'},
                        sequences: {
                            type: 'embedded_array',
                            embed: {
                                name: {
                                    type: 'string',
                                    required: true,
                                    namespace: true
                                },
                                condition: {
                                    type: 'function'
                                },
                                order: {
                                    type: 'number',
                                    default: 0
                                },
                                collection: {
                                    type: 'embedded',
                                    embed: 'plop'
                                },
                                input: {
                                    type: 'mixed_object',
                                    default: {}
                                },
                                output: {
                                    type: 'mixed_object',
                                    default: {}
                                }
                            }
                        },
                        data: {type: 'object'}
                    }
                }
            }
        );
    })
})