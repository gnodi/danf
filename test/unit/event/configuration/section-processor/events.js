'use strict';

require('../../../../../lib/common/init');

var assert = require('assert'),
    utils = require('../../../../../lib/common/utils'),
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
        var eventContract = {
                type: 'embedded_object',
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
            requestContract = {
                type: 'embedded_object',
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
        ;

        var eventContract_ = eventContract.embed,
            originalEventContract = utils.clone(eventContract),
            requestContract_ = requestContract.embed,
            originalRequestContract = utils.clone(requestContract)
        ;

        for (var i = 0; i <= 9; i++) {
            eventContract_.children = utils.clone(originalEventContract);
            eventContract_ = eventContract_.children.embed;
            requestContract_.children = utils.clone(originalRequestContract);
            requestContract_ = requestContract_.children.embed;
        }

        eventContract.namespace = true;
        eventContract.references = ['$'];
        eventContract.format = '...';
        requestContract.namespace = true;
        requestContract.references = ['$'];
        requestContract.format = '...';

        var expectedContract = {
                event: eventContract,
                request: requestContract
            },
            contract = events.contract
        ;

        contract.event.format = '...';
        contract.request.format = '...';

        assert.deepEqual(
            contract,
            expectedContract
        );
    })
})